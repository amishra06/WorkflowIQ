/*
  # Add workflow versioning system
  
  1. New Tables
    - `workflow_versions`: Stores version history for workflows
      - `id` (uuid, primary key)
      - `workflow_id` (uuid, references workflows)
      - `version_number` (integer)
      - `config` (jsonb)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `comment` (text)
      - `hash` (text)
  
  2. Security
    - Enable RLS on workflow_versions table
    - Add policies for viewing and creating versions
  
  3. Performance
    - Add indexes for workflow_id, created_by, and created_at
*/

CREATE TABLE IF NOT EXISTS workflow_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL REFERENCES auth.users,
  created_at timestamptz NOT NULL DEFAULT now(),
  comment text,
  hash text NOT NULL,
  UNIQUE(workflow_id, version_number)
);

-- Enable RLS
ALTER TABLE workflow_versions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view versions in their organization"
  ON workflow_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows w
      JOIN user_profiles up ON up.organization_id = w.organization_id
      WHERE w.id = workflow_versions.workflow_id
      AND up.id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions for their workflows"
  ON workflow_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows w
      WHERE w.id = workflow_versions.workflow_id
      AND w.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_workflow_versions_workflow_id ON workflow_versions(workflow_id);
CREATE INDEX idx_workflow_versions_created_by ON workflow_versions(created_by);
CREATE INDEX idx_workflow_versions_created_at ON workflow_versions(created_at);