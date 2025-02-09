/*
  # Update profiles policies for public access

  1. Changes
    - Drop existing select policy
    - Add new public read policy
*/

-- Drop existing select policy
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new public read policy
CREATE POLICY "Profiles are publicly readable"
  ON profiles
  FOR SELECT
  TO public
  USING (true);