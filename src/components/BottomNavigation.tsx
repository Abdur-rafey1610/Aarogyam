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
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    navigate(tab.path);
    onTabChange?.(tab.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id || 
            location.pathname === tab.path ||
            (tab.id !== '/' && location.pathname.startsWith(tab.path));
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center h-full w-full 
                transition-colors duration-200 
                ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                hover:bg-muted/50 active:bg-muted`}
            >
              <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full">
                <IconComponent size={20} className="mb-0.5" />
                <span className="text-[10px] font-medium leading-none mt-0.5">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;