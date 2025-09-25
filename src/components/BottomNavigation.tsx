import { Home, FileText, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'records', label: 'Records', icon: FileText, path: '/records' },
    { id: 'schemes', label: 'Schemes', icon: Heart, path: '/schemes' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'test-record', label: 'Test', icon: FileText, path: '/view-record/citizen/95026127911610' } // Test button
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    navigate(tab.path);
    onTabChange?.(tab.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id || 
            location.pathname === tab.path ||
            (tab.id !== '/' && location.pathname.startsWith(tab.path));
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <IconComponent size={20} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;