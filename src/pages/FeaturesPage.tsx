import React from 'react';
import { Helmet } from 'react-helmet';
import { Zap, Brain, Clock, Shield, Puzzle, BarChart } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import BackButton from '../components/common/BackButton';
import Card from '../components/common/Card';

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: Feature[] = [
  {
    title: "Intelligent Workflow Automation",
    description: "Build and deploy sophisticated workflows that adapt to your business needs using our intuitive drag-and-drop interface.",
    icon: Zap
  },
  {
    title: "Pattern Detection",
    description: "Our AI-powered system identifies repetitive tasks and suggests automation opportunities to boost productivity.",
    icon: Brain
  },
  {
    title: "Time Tracking & ROI Analysis",
    description: "Monitor time savings and calculate the return on investment for each automated workflow.",
    icon: Clock
  },
  {
    title: "Enterprise-Grade Security",
    description: "Rest easy with SOC 2 compliance, end-to-end encryption, and role-based access control.",
    icon: Shield
  },
  {
    title: "Seamless Integrations",
    description: "Connect with your existing tools through our extensive library of pre-built integrations.",
    icon: Puzzle
  },
  {
    title: "Advanced Analytics",
    description: "Gain insights into workflow performance and optimization opportunities through detailed analytics.",
    icon: BarChart
  }
];

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Features | WorkflowIQ</title>
      </Helmet>

      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <BackButton />
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Businesses
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need to automate and optimize your business processes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-lg text-primary-600 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;