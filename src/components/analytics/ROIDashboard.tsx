import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import Card from '../common/Card';
import { mockAnalyticsData } from '../../services/mockData';

const ROIDashboard: React.FC = () => {
  // Format minutes to hours for display
  const formatHours = (minutes: number) => {
    return `${(minutes / 60).toFixed(1)} hrs`;
  };
  
  // Calculate total cost savings
  const totalSavings = (mockAnalyticsData.timeSaved.total * 0.5).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ROI Dashboard</h2>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 12 months</option>
            <option>All time</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Time Savings</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Total Time Saved</p>
              <p className="text-3xl font-bold text-primary-600">
                {formatHours(mockAnalyticsData.timeSaved.total)}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm mb-2">Weekly Time Savings</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockAnalyticsData.timeSaved.byWeek}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{fontSize: 10}}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 60).toFixed(1)}h`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${(Number(value) / 60).toFixed(1)} hrs`, 'Time Saved']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Automation Types</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalyticsData.automations.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockAnalyticsData.automations.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} automations`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Financial Impact</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Total Cost Savings</p>
              <p className="text-3xl font-bold text-success-600">{totalSavings}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm mb-1">ROI Breakdown</p>
              <div className="space-y-3 mt-3">
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Cost Per Automation</span>
                    <span className="font-medium">
                      {mockAnalyticsData.roi.costPerAutomation.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Total Savings</span>
                    <span className="font-medium">{totalSavings}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Net Benefit</span>
                    <span className="font-medium">
                      {(mockAnalyticsData.roi.totalSavings - (mockAnalyticsData.automations.total * mockAnalyticsData.roi.costPerAutomation)).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-warning-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm mb-1">Payback Period</p>
              <p className="text-xl font-semibold">
                {mockAnalyticsData.roi.paybackPeriod} days <span className="text-success-500 text-sm font-normal">↓ 12% from average</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4">Daily Execution Volume</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockAnalyticsData.executionStats.byDay.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 10}}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} executions`, 'Count']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ROIDashboard;