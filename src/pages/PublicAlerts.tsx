import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PublicAlerts = () => {
  const navigate = useNavigate();

  const alerts = [
    {
      id: 1,
      type: 'urgent',
      title: 'Dengue Outbreak Alert - Delhi NCR',
      description: 'Increased dengue cases reported. Take preventive measures against mosquito breeding.',
      timestamp: '2 hours ago',
      location: 'Delhi, Gurgaon, Noida',
      actions: ['Use mosquito repellent', 'Remove stagnant water', 'Seek immediate care for fever']
    },
    {
      id: 2,
      type: 'info',
      title: 'COVID-19 Vaccination Drive',
      description: 'Free booster shots available at nearby health centers for eligible citizens.',
      timestamp: '6 hours ago',
      location: 'All districts',
      actions: ['Carry ABHA ID', 'Check eligibility online', 'Book slot in advance']
    },
    {
      id: 3,
      type: 'warning',
      title: 'Air Quality Index - Very Poor',
      description: 'AQI levels crossing 300. Vulnerable groups advised to stay indoors.',
      timestamp: '12 hours ago',
      location: 'Mumbai, Delhi, Kolkata',
      actions: ['Wear N95 masks outdoors', 'Avoid outdoor exercise', 'Use air purifiers']
    },
    {
      id: 4,
      type: 'success',
      title: 'New Health Center Operational',
      description: 'Additional primary health center now serving Sector 15 area with 24x7 services.',
      timestamp: '1 day ago',
      location: 'Sector 15, Faridabad',
      actions: ['Register for services', 'Get ABHA ID linked', 'Access emergency services']
    },
    {
      id: 5,
      type: 'info',
      title: 'Mental Health Awareness Week',
      description: 'Free counseling sessions and workshops available at community health centers.',
      timestamp: '2 days ago',
      location: 'All major cities',
      actions: ['Book counseling session', 'Attend workshops', 'Download mental health app']
    }
  ];

  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'urgent':
        return {
          icon: AlertTriangle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          badgeVariant: 'destructive' as const
        };
      case 'warning':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          badgeVariant: 'secondary' as const
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          badgeVariant: 'default' as const
        };
      default:
        return {
          icon: Info,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          badgeVariant: 'secondary' as const
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white p-2 hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Public Health Alerts</h1>
        </div>
        <p className="opacity-90">Stay informed about health advisories in your area</p>
      </div>

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button variant="default" size="sm" className="btn-capsule whitespace-nowrap">All</Button>
          <Button variant="outline" size="sm" className="btn-capsule whitespace-nowrap">Urgent</Button>
          <Button variant="outline" size="sm" className="btn-capsule whitespace-nowrap">Warnings</Button>
          <Button variant="outline" size="sm" className="btn-capsule whitespace-nowrap">Updates</Button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => {
            const config = getAlertConfig(alert.type);
            const IconComponent = config.icon;
            
            return (
              <Card key={alert.id} className={`card-soft ${config.bgColor} border-l-4 border-l-current`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full bg-background ${config.color}`}>
                    <IconComponent size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{alert.title}</h3>
                      <Badge variant={config.badgeVariant} className="capitalize">
                        {alert.type}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">LOCATION</span>
                        <p className="text-sm">{alert.location}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">TIME</span>
                        <p className="text-sm">{alert.timestamp}</p>
                      </div>
                    </div>
                    
                    {/* Action Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Recommended Actions:</h4>
                      <ul className="space-y-1">
                        {alert.actions.map((action, idx) => (
                          <li key={idx} className="text-sm flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="btn-capsule">
                        Share Alert
                      </Button>
                      <Button size="sm" className="btn-capsule">
                        More Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicAlerts;