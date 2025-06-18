/*
  # Add pattern suggestion tracking

  1. Schema Updates
    - Add suggestion_status to activity_patterns table
    - Add pattern_suggestions table for detailed tracking
    - Add real-time notification support

  2. Security
    - Enable RLS on new tables
    - Add policies for organization access
*/

-- Add suggestion status to activity_patterns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activity_patterns' AND column_name = 'suggestion_status'
  ) THEN
    ALTER TABLE activity_patterns ADD COLUMN suggestion_status TEXT DEFAULT 'new';
  END IF;
END $$;

-- Add pattern suggestions table for detailed tracking
CREATE TABLE IF NOT EXISTS pattern_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID NOT NULL REFERENCES activity_patterns(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  suggestion_type TEXT NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  suggested_workflow JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add real-time activity tracking
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  activity_type TEXT NOT NULL,
  activity_data JSONB NOT NULL DEFAULT '{}',
  context JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pattern_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view pattern suggestions in their organization" ON pattern_suggestions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.organization_id = pattern_suggestions.organization_id
      AND user_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pattern suggestions" ON pattern_suggestions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view activity logs in their organization" ON user_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.organization_id = user_activity_log.organization_id
      AND user_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create activity logs" ON user_activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_pattern_suggestions_organization_id ON pattern_suggestions(organization_id);
CREATE INDEX IF NOT EXISTS idx_pattern_suggestions_user_id ON pattern_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_suggestions_status ON pattern_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_timestamp ON user_activity_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_patterns_suggestion_status ON activity_patterns(suggestion_status);

-- Add updated_at trigger
CREATE TRIGGER update_pattern_suggestions_updated_at
  BEFORE UPDATE ON pattern_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();