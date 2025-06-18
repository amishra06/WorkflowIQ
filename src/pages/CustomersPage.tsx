import React from 'react';
import { Helmet } from 'react-helmet';
import { Star, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import BackButton from '../components/common/BackButton';
import Navbar from '../components/landing/Navbar';

const CustomersPage: React.FC = () => {
  const customers = [
    {
      name: 'TechCorp Solutions',
      logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300',
      industry: 'Technology',
      description:
        'Automated their client onboarding process, reducing time-to-value by 75%',
      metrics: {
        timeSaved: '40 hrs/week',
        roi: '450%',
        automations: 12,
      },
    },
    {
      name: 'Global Finance Inc.',
      logo: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=300',
      industry: 'Financial Services',
      description:
        'Streamlined compliance reporting workflows, ensuring 100% accuracy',
      metrics: {
        timeSaved: '25 hrs/week',
        roi: '320%',
        automations: 8,
      },
    },
    {
      name: 'Brand Accelerator',
      logo: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=300',
      industry: 'Marketing',
      description:
        'Automated campaign reporting across multiple platforms, saving 20+ hours weekly',
      metrics: {
        timeSaved: '20 hrs/week',
        roi: '280%',
        automations: 15,
      },
    },
  ];

  const testimonials = [
    {
      quote:
        "WorkflowIQ has transformed how we handle repetitive tasks. What used to take hours now happens automatically in the background. It's been a game-changer for our team's productivity.",
      author: 'Sarah Chen',
      title: 'Operations Director',
      company: 'TechCorp Solutions',
      rating: 5,
    },
    {
      quote:
        'The AI-powered pattern detection is incredible. It identified workflows we hadn\'t even considered automating, and the ROI has been substantial.',
      author: 'Michael Rodriguez',
      title: 'CTO',
      company: 'Global Finance Inc.',
      rating: 5,
    },
    {
      quote:
        'Implementation was smooth, and the support team was exceptional. We saw immediate benefits in terms of time savings and error reduction.',
      author: 'Emily Thompson',
      title: 'Marketing Manager',
      company: 'Brand Accelerator',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Customers | WorkflowIQ</title>
      </Helmet>

      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <BackButton />
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Customer Success Stories
            </h1>
            <p className="text-xl text-gray-600">
              See how leading companies are transforming their operations with
              WorkflowIQ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {customers.map((customer) => (
              <Card key={customer.name} className="overflow-hidden">
                <div className="aspect-video overflow-hidden mb-6">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {customer.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {customer.industry}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{customer.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Time Saved</p>
                      <p className="font-semibold text-primary-600">
                        {customer.metrics.timeSaved}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ROI</p>
                      <p className="font-semibold text-success-600">
                        {customer.metrics.roi}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Automations</p>
                      <p className="font-semibold">{customer.metrics.automations}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Read Case Study
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-gray-600">
                Don't just take our word for it. Here's what our customers have to
                say about their experience with WorkflowIQ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-warning-500 fill-warning-500"
                      />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join these successful companies and start automating your business
              processes today.
            </p>
            <Button size="lg">Start Free Trial</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;