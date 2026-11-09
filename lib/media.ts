export function getYouTubeEmbedUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
      else if (["embed", "shorts", "live"].includes(parts[0] || "")) id = parts[1] || "";
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? "https://www.youtube-nocookie.com/embed/" + id + "?rel=0" : null;
  } catch {
    return null;
  }
}