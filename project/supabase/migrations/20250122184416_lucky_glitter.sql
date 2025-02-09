/*
  # Add road frontage information to projects

  1. Changes
    - Add road_frontage column to projects table to store road-facing edges
    - Column will store array of point pairs indicating road frontage segments
*/

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS road_frontage JSONB;

COMMENT ON COLUMN projects.road_frontage IS 'Stores road frontage segments as array of point pairs [{start: {x,y}, end: {x,y}}]';