/*
  # Add parcel lines column to projects table

  1. Changes
    - Add `parcel_lines` JSONB column to store line data with tags
    - Add `nizam_type` text column to store building order type
*/

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS parcel_lines JSONB,
ADD COLUMN IF NOT EXISTS nizam_type text;

COMMENT ON COLUMN projects.parcel_lines IS 'Stores line data with tags (road, adjacent) as array of {start: {x,y}, end: {x,y}, tag: string}';
COMMENT ON COLUMN projects.nizam_type IS 'Building order type (ayrik, bitisik, ikiz, blok)';