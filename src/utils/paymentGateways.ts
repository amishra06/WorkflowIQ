export interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  availability: string[];
  fees: string;
  features: string[];
  setupComplexity: 'easy' | 'medium' | 'complex';
  documentation: string;
}

export const paymentGateways: PaymentGateway[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment platform with excellent developer experience',
    availability: ['US', 'EU', 'UK', 'Canada', 'Australia', '40+ countries'],
    fees: '2.9% + $0.30 per transaction',
    features: [
      'Global coverage',
      'Excellent documentation',
      'Advanced fraud protection',
      'Subscription billing',
      'Mobile payments',
      'Marketplace payments'
    ],
    setupComplexity: 'easy',
    documentation: 'https://stripe.com/docs'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Widely recognized payment platform with global reach',
    availability: ['200+ countries and regions'],
    fees: '2.9% + fixed fee (varies by country)',
    features: [
      'Global acceptance',
      'Buyer protection',
      'Express checkout',
      'Subscription billing',
      'Mobile payments',
      'Multi-currency support'
    ],
    setupComplexity: 'easy',
    documentation: 'https://developer.paypal.com'
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Popular in US, expanding globally',
    availability: ['US', 'Canada', 'Australia', 'UK', 'Ireland', 'Spain', 'France'],
    fees: '2.9% + $0.30 per transaction',
    features: [
      'In-person and online payments',
      'Inventory management',
      'Analytics dashboard',
      'Subscription billing',
      'Invoicing',
      'Point of sale'
    ],
    setupComplexity: 'easy',
    documentation: 'https://developer.squareup.com'
  },
  {
    id: 'adyen',
    name: 'Adyen',
    description: 'Enterprise-grade payment platform',
    availability: ['Global - 200+ payment methods'],
    fees: 'Custom pricing (typically 0.60% + interchange)',
    features: [
      'Unified commerce platform',
      'Advanced fraud protection',
      'Real-time data',
      'Local payment methods',
      'Multi-currency',
      'Enterprise features'
    ],
    setupComplexity: 'complex',
    documentation: 'https://docs.adyen.com'
  },
  {
    id: 'braintree',
    name: 'Braintree (PayPal)',
    description: 'PayPal-owned platform for developers',
    availability: ['45+ countries'],
    fees: '2.9% + $0.30 per transaction',
    features: [
      'PayPal integration',
      'Venmo payments',
      'Apple Pay & Google Pay',
      'Subscription billing',
      'Marketplace payments',
      'Advanced fraud tools'
    ],
    setupComplexity: 'medium',
    documentation: 'https://developers.braintreepayments.com'
  },
  {
    id: 'mollie',
    name: 'Mollie',
    description: 'European payment service provider',
    availability: ['Europe (30+ countries)'],
    fees: '1.8% + €0.25 per transaction',
    features: [
      'European focus',
      'Local payment methods',
      'SEPA Direct Debit',
      'iDEAL, Bancontact, etc.',
      'Subscription billing',
      'Multi-currency'
    ],
    setupComplexity: 'easy',
    documentation: 'https://docs.mollie.com'
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Leading payment gateway in India',
    availability: ['India', 'Malaysia (limited)', 'Singapore (limited)'],
    fees: '2% + ₹2 per transaction',
    features: [
      'UPI payments',
      'Net banking',
      'Digital wallets',
      'EMI options',
      'Subscription billing',
      'Payment links'
    ],
    setupComplexity: 'easy',
    documentation: 'https://razorpay.com/docs'
  }
];

export const getRecommendedGateway = (country: string): PaymentGateway => {
  if (country === 'IN') {
    return paymentGateways.find(g => g.id === 'razorpay')!;
  } else if (['US', 'CA', 'AU', 'GB'].includes(country)) {
    return paymentGateways.find(g => g.id === 'stripe')!;
  } else if (country.startsWith('EU') || ['DE', 'FR', 'NL', 'BE'].includes(country)) {
    return paymentGateways.find(g => g.id === 'mollie')!;
  } else {
    return paymentGateways.find(g => g.id === 'paypal')!;
  }
};

export const getAvailableGateways = (country: string): PaymentGateway[] => {
  return paymentGateways.filter(gateway => 
    gateway.availability.some(region => 
      region.includes(country) || 
      region.includes('Global') || 
      region.includes('200+') ||
      (country.startsWith('EU') && region.includes('Europe'))
    )
  );
};