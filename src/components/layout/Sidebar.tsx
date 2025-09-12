
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: '📈', path: '/dashboard' },
    { name: 'Leads', icon: '👥', path: '/leads' },
    { name: 'Campaigns', icon: '🚀', path: '/campaigns' },
    { name: 'Flow Builder', icon: '🌊', path: '/flow-builder' },
    { name: 'Inbox', icon: '📥', path: '/inbox' },
    { name: 'Analytics', icon: '📊', path: '/analytics' },
    { name: 'Integrations', icon: '🔗', path: '/integrations' },
    { name: 'AI Agents', icon: '🤖', path: '/ai-agents' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-xl font-bold">Agent Outreach AI</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors ${
              location.pathname === item.path ? 'bg-gray-700 text-white' : 'text-gray-300'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="px-2 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
