-- Storage bucket için politikalar
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Eski politikaları temizle
DROP POLICY IF EXISTS "Users can upload project documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their project documents" ON storage.objects;

-- Yeni politikalar
CREATE POLICY "Users can upload project documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents'
);

CREATE POLICY "Users can view project documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-documents'
);

CREATE POLICY "Users can update project documents"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents'
);

CREATE POLICY "Users can delete project documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-documents'
);