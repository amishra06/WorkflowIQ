import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowConfirmationMessage(false);
    setLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (isLogin) {
        const result = await login(email, password);
        if (result?.error) {
          // Only show confirmation message if explicitly required
          if (result.error.code === 'email_not_confirmed') {
            setShowConfirmationMessage(true);
            setError('Please confirm your email address before signing in');
            return;
          }
          throw new Error(result.error.message);
        }
        navigate(from, { replace: true });
      } else {
        const result = await register(email, password);
        if (result?.error) {
          // Only show confirmation message if email confirmation is required
          if (result.error.code === 'email_not_confirmed') {
            setShowConfirmationMessage(true);
            setError('Please check your email to confirm your account');
            return;
          }
          throw new Error(result.error.message);
        }
        // If no error, registration was successful and auto-confirmed
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-800 flex flex-col">
      <div className="p-4">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                <BrainCircuit size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Sign in to WorkflowIQ' : 'Create your account'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isLogin
                  ? 'Enter your credentials to access your account'
                  : 'Get started with your free trial, no credit card required'}
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-danger-50 text-danger-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {showConfirmationMessage && (
              <div className="mb-6 p-3 bg-info-50 text-info-700 rounded-md text-sm">
                <p className="font-medium mb-1">Please check your email</p>
                <p>We've sent a confirmation link to <span className="font-medium">{email}</span>. Click the link to verify your email address and activate your account.</p>
                <p className="mt-2 text-xs">Don't see the email? Check your spam folder or <button onClick={() => setShowConfirmationMessage(false)} className="text-info-700 underline">try again</button></p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
              
              <Input
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                helperText={!isLogin ? "Must be at least 6 characters" : undefined}
              />
              
              {isLogin && (
                <div className="text-right">
                  <a href="#\" className="text-sm text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                icon={isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
              >
                {isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setShowConfirmationMessage(false);
                  }}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;