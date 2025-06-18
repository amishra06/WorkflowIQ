import React from 'react';
import { Helmet } from 'react-helmet';
import ROICalculator from '../components/roi/ROICalculator';
import Navbar from '../components/landing/Navbar';
import BackButton from '../components/common/BackButton';

const ROICalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>ROI Calculator | WorkflowIQ</title>
      </Helmet>

      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <BackButton />
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Automation ROI
            </h1>
            <p className="text-xl text-gray-600">
              See how much time and money you could save by automating your workflows
            </p>
          </div>

          <ROICalculator />
        </div>
      </div>
    </div>
  );
};

export default ROICalculatorPage;