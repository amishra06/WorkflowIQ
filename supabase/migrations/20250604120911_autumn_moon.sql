-- Add region support
ALTER TABLE organizations
ADD COLUMN preferred_region TEXT,
ADD COLUMN multi_region_enabled BOOLEAN DEFAULT false;

-- Add SLA definitions
CREATE TABLE sla_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    uptime NUMERIC(5,2) NOT NULL,
    response_time INTEGER NOT NULL,
    priority TEXT NOT NULL,
    support_hours TEXT NOT NULL,
    response_time_hours INTEGER NOT NULL,
    resolution_time_hours INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add performance metrics for SLA tracking
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    sla_id UUID REFERENCES sla_definitions(id),
    uptime NUMERIC(5,2) NOT NULL,
    response_time INTEGER NOT NULL,
    error_rate NUMERIC(5,2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sla_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "SLA definitions are viewable by organization members" ON sla_definitions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = sla_definitions.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

CREATE POLICY "Performance metrics are viewable by organization members" ON performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.organization_id = performance_metrics.organization_id
            AND user_profiles.id = auth.uid()
        )
    );

-- Add indexes
CREATE INDEX idx_sla_definitions_organization_id ON sla_definitions(organization_id);
CREATE INDEX idx_performance_metrics_organization_id ON performance_metrics(organization_id);
CREATE INDEX idx_performance_metrics_sla_id ON performance_metrics(sla_id);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Add updated_at trigger for sla_definitions
CREATE TRIGGER update_sla_definitions_updated_at
    BEFORE UPDATE ON sla_definitions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();