import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project } from "@/lib/types";

const BUCKET = "portfolio-media";
const MARK = "/storage/v1/object/public/" + BUCKET + "/";

export function storagePathFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const i = url.indexOf(MARK);
  if (i < 0) return null;
  return decodeURIComponent(url.slice(i + MARK.length).split("?")[0]);
}

export function projectFilePaths(p: Partial<Project>): string[] {
  const all = [p.thumbnail_url, p.video_url, p.before_image_url, p.after_image_url].map(storagePathFromUrl);
  return Array.from(new Set(all.filter((x): x is string => Boolean(x))));
}

/**
 * Borra del Storage solo los archivos que ningún proyecto sigue usando.
 * Nunca toca "library/" (biblioteca compartida). Llamar DESPUÉS de actualizar o borrar la fila.
 */
export async function removeUnreferencedFiles(supabase: SupabaseClient, paths: string[]): Promise<{ removed: number; error?: string }> {
  const candidates = paths.filter(p => !p.startsWith("library/"));
  if (!candidates.length) return { removed: 0 };
  const { data, error } = await supabase.from("projects").select("thumbnail_url,video_url,before_image_url,after_image_url");
  if (error) return { removed: 0, error: error.message };
  const used = new Set((data || []).flatMap(row => projectFilePaths(row as Partial<Project>)));
  const orphans = candidates.filter(p => !used.has(p));
  if (!orphans.length) return { removed: 0 };
  const res = await supabase.storage.from(BUCKET).remove(orphans);
  return res.error ? { removed: 0, error: res.error.message } : { removed: orphans.length };
}
