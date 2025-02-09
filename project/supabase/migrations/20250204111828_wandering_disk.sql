/*
  # Add Edge Selection Support

  1. New Columns
    - `road_frontages` (JSONB) - Stores road frontage segments
    - `parcel_lines` (JSONB) - Stores all parcel lines with their types
    - `nizam_type` (text) - Building order type

  2. Changes
    - Add new columns for storing edge selection data
    - Add comments for better documentation
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