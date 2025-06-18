import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Check, CreditCard } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import BackButton from '../components/common/BackButton';
import Navbar from '../components/landing/Navbar';
import GlobalPaymentSelector from '../components/payment/GlobalPaymentSelector';
import { PaymentGateway } from '../utils/paymentGateways';

const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 49 : 39,
      description: 'Perfect for small teams just getting started with automation',
      features: [
        'Up to 5 team members',
        '10 active workflows',
        'Basic integrations',
        'Email support',
        '5 AI pattern detections/month',
        'Basic analytics',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 99 : 79,
      description: 'For growing teams that need more power and flexibility',
      features: [
        'Up to 20 team members',
        'Unlimited workflows',
        'Advanced integrations',
        'Priority support',
        '50 AI pattern detections/month',
        'Advanced analytics & reporting',
        'Custom branding',
        'API access',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 299 : 239,
      description: 'Custom solutions for large organizations',
      features: [
        'Unlimited team members',
        'Unlimited workflows',
        'Premium integrations',
        'Dedicated support',
        'Unlimited AI pattern detection',
        'Custom analytics',
        'SSO & advanced security',
        'Custom development',
        'SLA guarantee',
      ],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleStartTrial = () => {
    if (!selectedPlan) return;
    setShowPaymentSelector(true);
  };

  const handleGatewaySelect = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    // Here you would integrate with the selected payment gateway
    console.log('Selected payment gateway:', gateway);
    
    // For demo purposes, show an alert
    alert(`You selected ${gateway.name}! In a real implementation, this would redirect to ${gateway.name}'s checkout.`);
  };

  if (showPaymentSelector) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Choose Payment Method | WorkflowIQ</title>
        </Helmet>

        <Navbar />

        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <BackButton />
            
            <GlobalPaymentSelector
              onSelect={handleGatewaySelect}
              selectedGateway={selectedGateway?.id}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Pricing | WorkflowIQ</title>
      </Helmet>

      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <BackButton />
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that best fits your team's needs. All plans include a
              14-day free trial.
            </p>

            <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-lg">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual
                <span className="ml-1 text-success-600">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-primary-500 shadow-lg scale-[1.02]'
                    : plan.popular
                    ? 'border-2 border-primary-500 shadow-lg'
                    : 'border border-gray-200 hover:border-primary-300 hover:shadow'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mo' : 'mo annually'}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <Button
                    variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                    fullWidth
                    size="lg"
                    icon={<CreditCard size={18} />}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>

                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      What's included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start text-gray-600"
                        >
                          <Check
                            size={18}
                            className="text-success-500 mr-2 flex-shrink-0 mt-0.5"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            {selectedPlan ? (
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleStartTrial}
                loading={loading}
              >
                Continue to Payment
              </Button>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Select a plan to get started
              </h2>
            )}
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Need a custom solution? We offer tailored plans for large
              organizations with specific requirements. Contact our sales team to
              learn more.
            </p>
            <Button variant="outline" size="lg" className="mt-4">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;