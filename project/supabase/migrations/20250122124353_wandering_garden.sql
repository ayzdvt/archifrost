/*
  # Add new project fields for detailed analysis

  1. Changes
    - Add new columns to projects table for detailed property information:
      - owner (text) - Property owner
      - sheet_no (text) - Sheet number
      - floor_count (integer) - Number of floors
      - front_setback (numeric) - Front setback distance in meters
      - side_setback (numeric) - Side setback distance in meters
      - rear_setback (numeric) - Rear setback distance in meters
      - roof_type (text) - Can be built or not
      - roof_angle (numeric) - Roof angle in degrees
      - building_order (text) - Building order type
      - plan_position (text) - Position in plan
      - ground_coverage_ratio (numeric) - TAKS value
      - floor_area_ratio (numeric) - Emsal value
*/

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS owner text,
ADD COLUMN IF NOT EXISTS sheet_no text,
ADD COLUMN IF NOT EXISTS floor_count integer,
ADD COLUMN IF NOT EXISTS front_setback numeric,
ADD COLUMN IF NOT EXISTS side_setback numeric,
ADD COLUMN IF NOT EXISTS rear_setback numeric,
ADD COLUMN IF NOT EXISTS roof_type text,
ADD COLUMN IF NOT EXISTS roof_angle numeric,
ADD COLUMN IF NOT EXISTS building_order text,
ADD COLUMN IF NOT EXISTS plan_position text,
ADD COLUMN IF NOT EXISTS ground_coverage_ratio numeric,
ADD COLUMN IF NOT EXISTS floor_area_ratio numeric;