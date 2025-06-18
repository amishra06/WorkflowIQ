import React, { useState } from 'react';
import { Calculator, Clock, DollarSign, Users } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';

interface ROIInputs {
  employeeCount: number;
  avgHourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
}

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    employeeCount: 10,
    avgHourlyRate: 50,
    hoursPerWeek: 5,
    weeksPerYear: 50,
  });

  const calculateROI = () => {
    const annualCost = 1200; // Example annual subscription cost
    const totalHours = inputs.hoursPerWeek * inputs.weeksPerYear;
    const savingsPerEmployee = totalHours * inputs.avgHourlyRate;
    const totalSavings = savingsPerEmployee * inputs.employeeCount;
    const roi = ((totalSavings - annualCost) / annualCost) * 100;
    
    return {
      annualSavings: totalSavings,
      roi,
      paybackPeriod: (annualCost / totalSavings) * 12, // in months
      hoursSaved: totalHours * inputs.employeeCount
    };
  };

  const results = calculateROI();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your ROI</h2>
            
            <div className="space-y-6">
              <Input
                label="Number of Employees"
                type="number"
                value={inputs.employeeCount}
                onChange={(e) => setInputs({ ...inputs, employeeCount: +e.target.value })}
                icon={<Users size={16} className="text-gray-400" />}
              />
              
              <Input
                label="Average Hourly Rate ($)"
                type="number"
                value={inputs.avgHourlyRate}
                onChange={(e) => setInputs({ ...inputs, avgHourlyRate: +e.target.value })}
                icon={<DollarSign size={16} className="text-gray-400" />}
              />
              
              <Input
                label="Hours Spent on Manual Tasks (per week)"
                type="number"
                value={inputs.hoursPerWeek}
                onChange={(e) => setInputs({ ...inputs, hoursPerWeek: +e.target.value })}
                icon={<Clock size={16} className="text-gray-400" />}
              />
              
              <Input
                label="Working Weeks per Year"
                type="number"
                value={inputs.weeksPerYear}
                onChange={(e) => setInputs({ ...inputs, weeksPerYear: +e.target.value })}
                icon={<Calculator size={16} className="text-gray-400" />}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Projected Annual Impact</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Cost Savings</p>
                <p className="text-3xl font-bold text-success-600">
                  ${results.annualSavings.toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Return on Investment</p>
                <p className="text-3xl font-bold text-primary-600">
                  {results.roi.toFixed(0)}%
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Payback Period</p>
                <p className="text-3xl font-bold text-gray-900">
                  {results.paybackPeriod.toFixed(1)} months
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Hours Saved Annually</p>
                <p className="text-3xl font-bold text-gray-900">
                  {results.hoursSaved.toLocaleString()} hours
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  * Calculations based on industry averages and customer data. Actual results may vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ROICalculator;