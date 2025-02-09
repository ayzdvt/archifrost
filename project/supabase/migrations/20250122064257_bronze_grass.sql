/*
  # Add project details fields

  1. Changes
    - Add new columns to projects table:
      - city (text)
      - district (text)
      - neighborhood (text)
      - block (text)
      - parcel (text)
      - land_area (numeric)
      - unit_count (integer)
*/

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS block text,
ADD COLUMN IF NOT EXISTS parcel text,
ADD COLUMN IF NOT EXISTS land_area numeric,
ADD COLUMN IF NOT EXISTS unit_count integer;