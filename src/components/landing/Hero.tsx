import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/register');
  };

  const handleCalculateROI = () => {
    navigate('/roi-calculator');
  };

  const handleScheduleDemo = () => {
    window.location.href = 'https://calendly.com/workflowiq/demo';
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
              <BrainCircuit size={16} className="mr-2" />
              AI-Powered Workflow Automation
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stop Doing Repetitive Work.
            <br />
            <span className="text-primary-300">Let AI Build Your Automations.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            WorkflowIQ intelligently observes your workplace patterns and automatically generates
            custom workflow automations, saving your team hours of repetitive tasks every week.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-primary-500 text-white hover:bg-primary-600 px-8 py-3 w-full sm:w-auto"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              icon={<Calculator size={18} />}
              onClick={handleCalculateROI}
            >
              Calculate ROI
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              onClick={handleScheduleDemo}
            >
              Schedule Demo
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-white">85%</p>
              <p className="mt-1 text-primary-200">Time Saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">$2.5M+</p>
              <p className="mt-1 text-primary-200">Customer ROI</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="mt-1 text-primary-200">Success Rate</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;