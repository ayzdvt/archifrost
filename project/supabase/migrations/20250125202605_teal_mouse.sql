/*
  # Kat adedi alanını metin olarak güncelleme

  1. Değişiklikler
    - `floor_count` kolonunun tipini integer'dan text'e çevirme
*/

ALTER TABLE projects 
  ALTER COLUMN floor_count TYPE text USING floor_count::text;

COMMENT ON COLUMN projects.floor_count IS 'Maksimum kat sayısı bilgisi (örn: "En fazla 6 kat yapılabilir")';