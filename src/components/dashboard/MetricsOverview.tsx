import React from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import { mockAnalyticsData } from '../../services/mockData';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, trend, trendValue }) => {
  return (
    <Card className="h-full">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trend === 'up' ? 'text-success-500' : 'text-danger-500'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
};

const MetricsOverview: React.FC = () => {
  // Format time saved in a more readable way
  const formatTimeSaved = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours} hours`;
  };

  // Calculate success rate percentage
  const successRate = ((mockAnalyticsData.executionStats.success / mockAnalyticsData.executionStats.total) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Time Saved"
        value={formatTimeSaved(mockAnalyticsData.timeSaved.total)}
        description="Total time saved across all automations"
        icon={<Clock size={20} />}
        trend="up"
        trendValue="12% from last month"
      />
      <MetricCard
        title="Active Workflows"
        value={mockAnalyticsData.automations.active}
        description={`Out of ${mockAnalyticsData.automations.total} total workflows`}
        icon={<TrendingUp size={20} />}
      />
      <MetricCard
        title="Successful Executions"
        value={mockAnalyticsData.executionStats.success}
        description={`${successRate}% success rate`}
        icon={<CheckCircle size={20} />}
        trend="up"
        trendValue="3.2% from last week"
      />
      <MetricCard
        title="Failed Executions"
        value={mockAnalyticsData.executionStats.failed}
        description="Requiring attention or fixes"
        icon={<AlertCircle size={20} />}
        trend="down"
        trendValue="5% from last week"
      />
    </div>
  );
};

export default MetricsOverview;