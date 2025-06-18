import React, { useState, useEffect } from 'react';
import { CreditCard, Globe, Check, ExternalLink } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { paymentGateways, getRecommendedGateway, getAvailableGateways, PaymentGateway } from '../../utils/paymentGateways';

interface GlobalPaymentSelectorProps {
  onSelect: (gateway: PaymentGateway) => void;
  selectedGateway?: string;
}

const GlobalPaymentSelector: React.FC<GlobalPaymentSelectorProps> = ({
  onSelect,
  selectedGateway
}) => {
  const [userCountry, setUserCountry] = useState<string>('US');
  const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>([]);
  const [recommendedGateway, setRecommendedGateway] = useState<PaymentGateway | null>(null);

  useEffect(() => {
    // Detect user's country (you can use a geolocation service)
    detectUserCountry();
  }, []);

  useEffect(() => {
    const available = getAvailableGateways(userCountry);
    const recommended = getRecommendedGateway(userCountry);
    
    setAvailableGateways(available);
    setRecommendedGateway(recommended);
  }, [userCountry]);

  const detectUserCountry = async () => {
    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setUserCountry(data.country_code || 'US');
    } catch (error) {
      console.error('Failed to detect country:', error);
      setUserCountry('US'); // Default to US
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'text-success-600 bg-success-100';
      case 'medium': return 'text-warning-600 bg-warning-100';
      case 'complex': return 'text-danger-600 bg-danger-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Payment Gateway</h2>
          <p className="text-gray-600 mt-1">
            Select the best payment solution for your region
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Globe size={16} />
          <span>Detected: {userCountry}</span>
        </div>
      </div>

      {recommendedGateway && (
        <Card className="border-primary-200 bg-primary-50">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-primary-900">
                    Recommended: {recommendedGateway.name}
                  </h3>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                    Best for {userCountry}
                  </span>
                </div>
                <p className="text-primary-700 mt-1">{recommendedGateway.description}</p>
                <p className="text-primary-600 text-sm mt-2">
                  Fees: {recommendedGateway.fees}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => onSelect(recommendedGateway)}
                icon={<Check size={16} />}
              >
                Use Recommended
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableGateways.map((gateway) => (
          <Card 
            key={gateway.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedGateway === gateway.id 
                ? 'ring-2 ring-primary-500 border-primary-500' 
                : 'hover:border-primary-300'
            }`}
            onClick={() => onSelect(gateway)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {gateway.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {gateway.description}
                  </p>
                </div>
                {selectedGateway === gateway.id && (
                  <Check size={20} className="text-primary-500" />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Fees</p>
                  <p className="text-sm text-gray-600">{gateway.fees}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Setup Complexity</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getComplexityColor(gateway.setupComplexity)}`}>
                    {gateway.setupComplexity}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Features</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {gateway.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={12} className="text-success-500 mr-1" />
                        {feature}
                      </li>
                    ))}
                    {gateway.features.length > 3 && (
                      <li className="text-gray-500">
                        +{gateway.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <a
                    href={gateway.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Documentation
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help Choosing?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">For Global Reach:</p>
              <p className="text-gray-600">Choose Stripe or PayPal</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">For Europe:</p>
              <p className="text-gray-600">Consider Mollie for local methods</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">For India:</p>
              <p className="text-gray-600">Razorpay is the clear winner</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GlobalPaymentSelector;