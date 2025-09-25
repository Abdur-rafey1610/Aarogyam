import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Records = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    navigate(`/records/${value}`);
  };

  const getActiveTab = () => {
    const path = location.pathname.split('/')[2];
    return path || 'prescriptions'; // Default to prescriptions
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white p-2 hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Your Health Records</h1>
        </div>
        <p className="opacity-90 ml-14">A centralized view of your medical history</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue={getActiveTab()} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="prescriptions" className="record-tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Prescriptions</TabsTrigger>
            <TabsTrigger value="lab-reports" className="record-tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lab Reports</TabsTrigger>
            <TabsTrigger value="immunization" className="record-tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Immunization</TabsTrigger>
            <TabsTrigger value="allergies" className="record-tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Allergies</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <Outlet />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Records;
