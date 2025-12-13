-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true);

-- Allow public read access to media
CREATE POLICY "Public media access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated users to upload media
CREATE POLICY "Users can upload media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media');

-- Allow users to delete their own media
CREATE POLICY "Users can delete own media" ON storage.objects
FOR DELETE USING (bucket_id = 'media');