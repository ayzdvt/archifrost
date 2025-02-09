-- Create function to delete project files from storage
CREATE OR REPLACE FUNCTION delete_project_storage()
RETURNS TRIGGER AS $$
DECLARE
  file_count INTEGER;
BEGIN
  -- Delete all files in the project's folder
  WITH deleted_files AS (
    DELETE FROM storage.objects
    WHERE bucket_id = 'project-documents'
    AND position(OLD.id::text in name) = 1
    RETURNING 1
  )
  SELECT count(*) INTO file_count FROM deleted_files;
  
  RAISE NOTICE 'Deleted % files for project %', file_count, OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS cleanup_project_storage ON projects;

-- Create trigger to run before project deletion
CREATE TRIGGER cleanup_project_storage
  BEFORE DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION delete_project_storage();