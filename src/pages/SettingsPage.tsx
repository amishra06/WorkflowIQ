import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  User, 
  Building, 
  Key, 
  Shield, 
  Bell, 
  Globe,
  Save,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
    role: user?.role || 'member'
  });

  // Organization settings state
  const [organizationData, setOrganizationData] = useState({
    name: 'Demo Organization',
    industry: 'Technology',
    size: 'medium',
    timezone: 'UTC',
    language: 'en'
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'wiq_1234567890abcdef',
      scopes: ['read:workflows', 'write:workflows'],
      lastUsed: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    workflowAlerts: true,
    weeklyReports: false,
    securityAlerts: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'organization', name: 'Organization', icon: Building },
    { id: 'api-keys', name: 'API Keys', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile updated:', profileData);
      // Here you would typically call your API to update the profile
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Organization updated:', organizationData);
    } catch (error) {
      console.error('Failed to update organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `wiq_${Math.random().toString(36).substring(2, 15)}`,
      scopes: ['read:workflows'],
      lastUsed: null,
      createdAt: new Date().toISOString()
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileData.avatarUrl ? (
                  <img 
                    src={profileData.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              <div>
                <Button variant="outline" size="sm" icon={<Upload size={16} />}>
                  Change Avatar
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleProfileSave}
              loading={loading}
              icon={<Save size={16} />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Organization Name"
                value={organizationData.name}
                onChange={(e) => setOrganizationData({ ...organizationData, name: e.target.value })}
                placeholder="Enter organization name"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={organizationData.industry}
                  onChange={(e) => setOrganizationData({ ...organizationData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Size
                </label>
                <select
                  value={organizationData.size}
                  onChange={(e) => setOrganizationData({ ...organizationData, size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="small">Small (1-10 employees)</option>
                  <option value="medium">Medium (11-50 employees)</option>
                  <option value="large">Large (51-200 employees)</option>
                  <option value="enterprise">Enterprise (200+ employees)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={organizationData.timezone}
                  onChange={(e) => setOrganizationData({ ...organizationData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleOrganizationSave}
              loading={loading}
              icon={<Save size={16} />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderApiKeys = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleCreateApiKey}
              icon={<Plus size={16} />}
            >
              Create New Key
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            API keys allow you to authenticate with the WorkflowIQ API. Keep your keys secure and never share them publicly.
          </p>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {showApiKey ? apiKey.key : `${apiKey.key.substring(0, 8)}...`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                        icon={showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        icon={<Copy size={14} />}
                      />
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Scopes: {apiKey.scopes.join(', ')}</span>
                      <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                      {apiKey.lastUsed && (
                        <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteApiKey(apiKey.id)}
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                    {key === 'pushNotifications' && 'Receive push notifications in your browser'}
                    {key === 'workflowAlerts' && 'Get notified when workflows fail or complete'}
                    {key === 'weeklyReports' && 'Receive weekly summary reports'}
                    {key === 'securityAlerts' && 'Get notified about security events'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              variant="primary" 
              icon={<Save size={16} />}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <Button variant="outline" icon={<Shield size={16} />}>
                Enable 2FA
              </Button>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-2">Password</h4>
              <p className="text-sm text-gray-600 mb-4">
                Change your password to keep your account secure.
              </p>
              <Button variant="outline">
                Change Password
              </Button>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-2">Active Sessions</h4>
              <p className="text-sm text-gray-600 mb-4">
                View and manage your active sessions across different devices.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Current Session</p>
                    <p className="text-sm text-gray-500">Chrome on macOS • Last active now</p>
                  </div>
                  <span className="px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded">
                    Current
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'organization':
        return renderOrganizationSettings();
      case 'api-keys':
        return renderApiKeys();
      case 'notifications':
        return renderNotifications();
      case 'security':
        return renderSecurity();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings | WorkflowIQ</title>
      </Helmet>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account, organization, and application preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card>
              <nav className="p-4">
                <ul className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <Icon
                            size={18}
                            className={`mr-3 ${
                              activeTab === tab.id ? 'text-primary-600' : 'text-gray-500'
                            }`}
                          />
                          {tab.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;