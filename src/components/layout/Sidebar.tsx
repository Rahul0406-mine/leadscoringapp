
import React from 'react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: '📈' },
    { name: 'Leads', icon: '👥' },
    { name: 'Campaigns', icon: '🚀' },
    { name: 'Flow Builder', icon: '🌊' },
    { name: 'Inbox', icon: '📥' },
    { name: 'Analytics', icon: '📊' },
    { name: 'Integrations', icon: '🔗' },
    { name: 'AI Agents', icon: '🤖' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-xl font-bold">Agent Outreach AI</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={`/${item.name.toLowerCase().replace(' ', '-')}`}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
