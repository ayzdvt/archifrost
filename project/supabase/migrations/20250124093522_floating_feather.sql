/*
  # Storage ve Koordinat Sistemi Güncellemesi

  1. Storage
    - project-documents bucket'ını oluştur
    - Storage politikalarını güncelle
  
  2. Parsel Koordinatları
    - projects tablosuna parsel_coordinates kolonu ekle
    - Koordinat verisi için JSON yapısı tanımla
*/

-- Storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Eski storage politikalarını temizle
DROP POLICY IF EXISTS "Users can upload project documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view project documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update project documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete project documents" ON storage.objects;

-- Yeni storage politikaları
CREATE POLICY "Users can upload project documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text
    FROM projects
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view project documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text
    FROM projects
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update project documents"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text
    FROM projects
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete project documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text
    FROM projects
    WHERE user_id = auth.uid()
  )
);

-- Parsel koordinatları için kolon ekle
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS parcel_coordinates JSONB;

COMMENT ON COLUMN projects.parcel_coordinates IS 'Stores parcel corner coordinates as array of {x,y} points';