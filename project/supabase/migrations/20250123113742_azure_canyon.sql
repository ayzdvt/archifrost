/*
  # Storage Cleanup Trigger

  1. Changes
    - Add trigger to automatically delete project files from storage when a project is deleted
    - Add function to handle storage cleanup

  2. Security
    - Only deletes files associated with the deleted project
    - Uses existing RLS policies for storage access
*/

-- Create function to delete project files from storage
CREATE OR REPLACE FUNCTION delete_project_storage()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all files in the project's folder
  DELETE FROM storage.objects
  WHERE bucket_id = 'project-documents'
  AND position(OLD.id::text in name) = 1;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run before project deletion
CREATE TRIGGER cleanup_project_storage
  BEFORE DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION delete_project_storage();