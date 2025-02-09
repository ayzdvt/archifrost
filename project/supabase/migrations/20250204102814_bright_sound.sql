/*
  # Edge Selection Storage Schema

  1. Changes
    - Add road_frontages column to store road-facing edges
    - Add parcel_lines column to store all parcel edges with their types
    - Add nizam_type column to store building order type

  2. Column Details
    - road_frontages: JSONB array of {start: {x,y}, end: {x,y}} objects
    - parcel_lines: JSONB array of {start: {x,y}, end: {x,y}, type: string} objects
    - nizam_type: text enum ('ayrik', 'bitisik', 'ikiz', 'blok')
*/

-- Add columns if they don't exist
DO $$ 
BEGIN
  -- Add road_frontages column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'road_frontages'
  ) THEN
    ALTER TABLE projects ADD COLUMN road_frontages JSONB;
    COMMENT ON COLUMN projects.road_frontages IS 'Stores road frontage segments as array of {start: {x,y}, end: {x,y}} objects';
  END IF;

  -- Add parcel_lines column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'parcel_lines'
  ) THEN
    ALTER TABLE projects ADD COLUMN parcel_lines JSONB;
    COMMENT ON COLUMN projects.parcel_lines IS 'Stores line data with tags (road, adjacent) as array of {start: {x,y}, end: {x,y}, type: string}';
  END IF;

  -- Add nizam_type column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'nizam_type'
  ) THEN
    ALTER TABLE projects ADD COLUMN nizam_type text;
    COMMENT ON COLUMN projects.nizam_type IS 'Building order type (ayrik, bitisik, ikiz, blok)';
  END IF;
END $$;