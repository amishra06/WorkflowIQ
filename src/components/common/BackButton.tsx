import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="mb-6"
      icon={<ArrowLeft size={16} />}
      onClick={() => navigate('/')}
    >
      Back to Home
    </Button>
  );
};

export default BackButton;