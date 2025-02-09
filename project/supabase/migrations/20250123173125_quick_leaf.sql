/*
  # Projects and Documents Schema Update

  1. Changes
    - Add missing tables if they don't exist
    - Add missing columns and policies
    - Skip existing policies to avoid conflicts
*/

-- Create projects table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
    CREATE TABLE projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      user_id uuid REFERENCES auth.users NOT NULL,
      status text DEFAULT 'in_progress',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create documents table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documents') THEN
    CREATE TABLE documents (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
      name text NOT NULL,
      file_url text NOT NULL,
      file_type text NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Projects policies
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'projects' 
    AND policyname = 'Users can create their own projects'
  ) THEN
    CREATE POLICY "Users can create their own projects"
      ON projects
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'projects' 
    AND policyname = 'Users can update their own projects'
  ) THEN
    CREATE POLICY "Users can update their own projects"
      ON projects
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Documents policies
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'documents' 
    AND policyname = 'Users can view documents of their projects'
  ) THEN
    CREATE POLICY "Users can view documents of their projects"
      ON documents
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = documents.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'documents' 
    AND policyname = 'Users can create documents for their projects'
  ) THEN
    CREATE POLICY "Users can create documents for their projects"
      ON documents
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = documents.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'documents' 
    AND policyname = 'Users can delete documents of their projects'
  ) THEN
    CREATE POLICY "Users can delete documents of their projects"
      ON documents
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = documents.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;
END $$;