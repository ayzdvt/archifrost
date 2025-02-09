/*
  # Add road frontages column to projects table

  1. Changes
    - Add `road_frontages` JSONB column to store road frontage information
    - Column will store array of objects with start and end indices
    - Example: [{"start": 0, "end": 1}, {"start": 1, "end": 2}]

  2. Notes
    - Using JSONB for flexible storage of road frontage data
    - Each object represents a road-facing edge of the parcel
    - Indices refer to the parcel_coordinates array positions
*/

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS road_frontages JSONB;

COMMENT ON COLUMN projects.road_frontages IS 'Stores road frontage information as array of {start, end} objects representing parcel edges that face a road';