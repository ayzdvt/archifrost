/*
  # Add delete policy for projects

  1. Security
    - Add policy for authenticated users to delete their own projects
*/

-- Create delete policy for projects
CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);