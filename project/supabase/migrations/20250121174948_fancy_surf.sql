/*
  # Storage politikaları ekleme

  1. Güvenlik
    - Storage bucket için RLS politikaları ekleme
    - Kullanıcıların kendi proje dosyalarına erişim izni
*/

-- Storage bucket için politikalar
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload project documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents' AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE id::text = (storage.foldername(name))[1]
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their project documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-documents' AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE id::text = (storage.foldername(name))[1]
    AND user_id = auth.uid()
  )
);