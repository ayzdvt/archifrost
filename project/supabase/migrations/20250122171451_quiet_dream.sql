/*
  # Add parcel coordinates to projects table

  1. Changes
    - Add `parcel_coordinates` column to `projects` table to store corner coordinates
*/

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS parcel_coordinates JSONB;

COMMENT ON COLUMN projects.parcel_coordinates IS 'Stores parcel corner coordinates as array of {x,y} points';