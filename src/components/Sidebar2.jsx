import React from 'react';

function Sidebar2({ menuItems, activeMenu, setActiveMenu, setMobileMenuOpen }) {
  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white text-center">CRM Settings</h1>
      </div>
      <nav className="flex-1 p-4">
        {menuItems && menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`
              flex items-center w-full p-3 mb-2 rounded-lg transition-colors
              ${
                activeMenu === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar2;