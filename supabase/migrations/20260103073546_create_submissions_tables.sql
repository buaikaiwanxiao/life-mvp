/*
  # Create Submissions and Files Tables

  ## Overview
  This migration creates the core schema for the Life MVP application, allowing users to submit
  materials and files for processing. The system stores submission metadata, user contact info,
  and references to uploaded files.

  ## New Tables
  
  ### `submissions`
  Main table for storing user submission data:
  - `id` (uuid, primary key) - Unique identifier for each submission
  - `created_at` (timestamptz) - Timestamp of submission creation
  - `email` (text, required) - User's email address
  - `organization` (text) - User's organization name
  - `role` (text) - User's role/position
  - `notes` (text) - User's notes about what to focus on
  - `pasted_text` (text) - Any text content pasted by the user
  - `links` (jsonb) - Array of URLs provided by the user
  - `consent` (boolean) - User consent to share materials
  
  ### `submission_files`
  Table for storing metadata about uploaded files:
  - `id` (uuid, primary key) - Unique identifier for each file record
  - `submission_id` (uuid, foreign key) - References parent submission
  - `filename` (text) - Original filename
  - `mime_type` (text) - File MIME type
  - `size` (bigint) - File size in bytes
  - `storage_path` (text) - Path in Supabase storage
  - `created_at` (timestamptz) - Upload timestamp
  
  ## Security
  - RLS is enabled on both tables
  - Public insert access allowed for submissions (anyone can submit)
  - No public read access (admin-only via service role)
  - Cascade delete: when a submission is deleted, all its files are deleted
  
  ## Notes
  - Tables use IF NOT EXISTS to allow safe re-runs
  - UUIDs are auto-generated using gen_random_uuid()
  - Timestamps default to current time
  - Links are stored as JSONB array for flexibility
*/

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  organization text DEFAULT '',
  role text DEFAULT '',
  notes text DEFAULT '',
  pasted_text text DEFAULT '',
  links jsonb DEFAULT '[]'::jsonb,
  consent boolean DEFAULT false
);

-- Create submission_files table
CREATE TABLE IF NOT EXISTS submission_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  filename text NOT NULL,
  mime_type text DEFAULT '',
  size bigint DEFAULT 0,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_files ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert submissions (for the public submission form)
CREATE POLICY "Anyone can create submissions"
  ON submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Anyone can insert submission files (for the public submission form)
CREATE POLICY "Anyone can create submission files"
  ON submission_files
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create index on submission_id for faster joins
CREATE INDEX IF NOT EXISTS idx_submission_files_submission_id 
  ON submission_files(submission_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_submissions_created_at 
  ON submissions(created_at DESC);
