ALTER TABLE projects
ADD COLUMN IF NOT EXISTS parcel_lines JSONB,
ADD COLUMN IF NOT EXISTS nizam_type text;

COMMENT ON COLUMN projects.parcel_lines IS 'Stores line data with tags (road, adjacent) as array of {start: {x,y}, end: {x,y}, tag: string}';
COMMENT ON COLUMN projects.nizam_type IS 'Building order type (ayrik, bitisik, ikiz, blok)';