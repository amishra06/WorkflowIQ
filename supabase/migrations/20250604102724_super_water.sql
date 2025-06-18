/*
  # Add team collaboration features

  1. New Tables
    - `team_messages` - For in-app messaging and comments
    - `workflow_templates` - For shared workflow templates
    - `workflow_comments` - For workflow-specific comments
    - `team_activity` - For activity feed

  2. Security
    - Enable RLS on all new tables
    - Add policies for team member access
*/

-- Team messages
CREATE TABLE team_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    workflow_id UUID REFERENCES workflows(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow templates
CREATE TABLE workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    creator_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow comments
CREATE TABLE workflow_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES workflow_comments(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team activity
CREATE TABLE team_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    activity_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activity ENABLE ROW LEVEL SECURITY;

-- Team messages policies
CREATE POLICY "Users can view messages in their organization" ON team_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = team_messages.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages" ON team_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = team_messages.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

-- Workflow templates policies
CREATE POLICY "Users can view templates in their organization" ON workflow_templates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = workflow_templates.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can create templates" ON workflow_templates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = workflow_templates.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

-- Workflow comments policies
CREATE POLICY "Users can view comments on workflows" ON workflow_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workflows
            WHERE workflows.id = workflow_comments.workflow_id
            AND EXISTS (
                SELECT 1 FROM user_profiles
                WHERE user_profiles.organization_id = workflows.organization_id
                AND user_profiles.id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can add comments" ON workflow_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM workflows
            WHERE workflows.id = workflow_comments.workflow_id
            AND EXISTS (
                SELECT 1 FROM user_profiles
                WHERE user_profiles.organization_id = workflows.organization_id
                AND user_profiles.id = auth.uid()
            )
        )
    );

-- Team activity policies
CREATE POLICY "Users can view activity in their organization" ON team_activity
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = team_activity.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

-- Add updated_at triggers
CREATE TRIGGER update_team_messages_updated_at
    BEFORE UPDATE ON team_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at
    BEFORE UPDATE ON workflow_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_comments_updated_at
    BEFORE UPDATE ON workflow_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_team_messages_organization_id ON team_messages(organization_id);
CREATE INDEX idx_team_messages_sender_id ON team_messages(sender_id);
CREATE INDEX idx_team_messages_recipient_id ON team_messages(recipient_id);
CREATE INDEX idx_workflow_templates_organization_id ON workflow_templates(organization_id);
CREATE INDEX idx_workflow_comments_workflow_id ON workflow_comments(workflow_id);
CREATE INDEX idx_team_activity_organization_id ON team_activity(organization_id);
CREATE INDEX idx_team_activity_user_id ON team_activity(user_id);
CREATE INDEX idx_team_activity_created_at ON team_activity(created_at);