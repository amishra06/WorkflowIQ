import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsMetrics } from '../../services/analytics/metrics';
import { predictiveAnalytics } from '../../services/analytics/predictive';
import Card from '../common/Card';

interface AdvancedMetricsProps {
  workflowId: string;
}

const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ workflowId }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadMetrics();
  }, [workflowId, timeRange]);

  const loadMetrics = async () => {
    const performanceMetrics = await analyticsMetrics.getWorkflowPerformanceMetrics(
      workflowId,
      timeRange
    );
    setMetrics(performanceMetrics);

    const workflowPredictions = await predictiveAnalytics.getWorkflowPredictions(
      workflowId
    );
    setPredictions(workflowPredictions);
  };

  if (!metrics || !predictions) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        <select
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Execution Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.executionTime.trend.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Average</p>
              <p className="font-semibold">{metrics.executionTime.average}ms</p>
            </div>
            <div>
              <p className="text-gray-500">95th Percentile</p>
              <p className="font-semibold">{metrics.executionTime.p95}ms</p>
            </div>
            <div>
              <p className="text-gray-500">Trend</p>
              <p className={`font-semibold ${
                metrics.executionTime.trend.direction === 'improving'
                  ? 'text-success-600'
                  : metrics.executionTime.trend.direction === 'degrading'
                  ? 'text-danger-600'
                  : ''
              }`}>
                {metrics.executionTime.trend.direction}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Reliability Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Success', value: metrics.reliability.successRate },
                    { name: 'Failure', value: 100 - metrics.reliability.successRate }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">MTBF</p>
              <p className="font-semibold">
                {Math.round(metrics.reliability.mtbf / 60)} minutes
              </p>
            </div>
            <div>
              <p className="text-gray-500">Failure Probability</p>
              <p className="font-semibold">
                {predictions.failureProbability.probability.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.resourceUsage.history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cpu" fill="#3b82f6" name="CPU" />
                <Bar dataKey="memory" fill="#10b981" name="Memory" />
                <Bar dataKey="network" fill="#f59e0b" name="Network" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">CPU Trend</p>
              <p className="font-semibold">
                {predictions.resourceUsage.cpu.trend}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Memory Trend</p>
              <p className="font-semibold">
                {predictions.resourceUsage.memory.trend}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Network Trend</p>
              <p className="font-semibold">
                {predictions.resourceUsage.network.trend}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Cost Efficiency</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Cost per Execution</span>
                <span className="font-semibold">
                  ${metrics.costEfficiency.costPerExecution.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (metrics.costEfficiency.costPerExecution / 2) * 100,
                      100
                    )}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">ROI</span>
                <span className="font-semibold">
                  {metrics.costEfficiency.roi.toFixed(2)}x
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-success-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min((metrics.costEfficiency.roi / 5) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {metrics.costEfficiency.savingsOpportunities.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Optimization Opportunities
                </h4>
                <ul className="space-y-2 text-sm">
                  {metrics.costEfficiency.savingsOpportunities.map((opportunity: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedMetrics;