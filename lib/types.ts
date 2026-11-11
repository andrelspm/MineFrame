export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string | null;
  before_image_url?: string | null;
  after_image_url?: string | null;
  // Requieren supabase/migrations/001_tags_external_url.sql
  tags?: string[] | null;
  external_url?: string | null;
  media_type: "image" | "video" | "before_after";
  published: boolean;
  created_at: string;
};
