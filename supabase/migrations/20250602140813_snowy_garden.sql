-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'member', 'viewer');
CREATE TYPE workflow_status AS ENUM ('active', 'inactive', 'draft');
CREATE TYPE integration_status AS ENUM ('connected', 'disconnected', 'error');
CREATE TYPE organization_size AS ENUM ('small', 'medium', 'large', 'enterprise');
CREATE TYPE activity_pattern_type AS ENUM ('email', 'data-entry', 'reporting', 'approval', 'other');

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    industry TEXT,
    size organization_size NOT NULL DEFAULT 'small',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    organization_id UUID REFERENCES organizations(id),
    role user_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflows table
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status workflow_status NOT NULL DEFAULT 'draft',
    user_id UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    config JSONB NOT NULL DEFAULT '{}',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    time_saved INTEGER DEFAULT 0,
    execution_count INTEGER DEFAULT 0,
    success_rate NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT NOT NULL,
    status integration_status NOT NULL DEFAULT 'disconnected',
    user_id UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    config JSONB NOT NULL DEFAULT '{}',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity patterns table
CREATE TABLE activity_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    frequency INTEGER NOT NULL DEFAULT 0,
    confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    potential_time_saving INTEGER NOT NULL DEFAULT 0,
    type activity_pattern_type NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    suggested_workflow_id UUID REFERENCES workflows(id),
    last_detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow executions table
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    status TEXT NOT NULL,
    execution_time INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Organization policies
CREATE POLICY "Organizations are viewable by organization members" ON organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = organizations.id
            AND user_profiles.id = auth.uid()
        )
    );

-- User profile policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Workflow policies
CREATE POLICY "Users can view workflows in their organization" ON workflows
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = workflows.organization_id
            AND user_profiles.id = auth.uid()
        )
    );
CREATE POLICY "Users can create workflows" ON workflows
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = workflows.organization_id
            AND user_profiles.id = auth.uid()
        )
    );
CREATE POLICY "Users can update their own workflows" ON workflows
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own workflows" ON workflows
    FOR DELETE USING (user_id = auth.uid());

-- Integration policies
CREATE POLICY "Users can view integrations in their organization" ON integrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = integrations.organization_id
            AND user_profiles.id = auth.uid()
        )
    );
CREATE POLICY "Users can manage their own integrations" ON integrations
    FOR ALL USING (user_id = auth.uid());

-- Activity pattern policies
CREATE POLICY "Users can view patterns in their organization" ON activity_patterns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = activity_patterns.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

-- Workflow execution policies
CREATE POLICY "Users can view executions in their organization" ON workflow_executions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = workflow_executions.organization_id
            AND user_profiles.id = auth.uid()
        )
    );
CREATE POLICY "Users can create execution logs" ON workflow_executions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflows_organization_id ON workflows(organization_id);
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_organization_id ON integrations(organization_id);
CREATE INDEX idx_activity_patterns_user_id ON activity_patterns(user_id);
CREATE INDEX idx_activity_patterns_organization_id ON activity_patterns(organization_id);
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX idx_workflow_executions_created_at ON workflow_executions(created_at);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();