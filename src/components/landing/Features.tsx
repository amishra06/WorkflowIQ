import { Zap, Brain, Clock, Shield, Puzzle, BarChart } from 'lucide-react';

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

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Powerful Features for Modern Businesses
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to automate and optimize your business processes
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="relative p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-lg text-blue-600 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}