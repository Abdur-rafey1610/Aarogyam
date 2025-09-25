import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, MapPin, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Immunization = () => {
  const immunizations = [
    {
      id: 1,
      vaccine: 'COVID-19 Booster (Pfizer)',
      date: '2024-08-15',
      location: 'AIIMS Delhi',
      batchNo: 'PF2024081501',
      status: 'Completed',
      nextDue: null,
      type: 'Booster'
    },
    {
      id: 2,
      vaccine: 'Influenza Vaccine 2024',
      date: '2024-07-20',
      location: 'Max Healthcare',
      batchNo: 'FLU202407001',
      status: 'Completed',
      nextDue: '2025-07-20',
      type: 'Annual'
    },
    {
      id: 3,
      vaccine: 'Hepatitis B (3rd Dose)',
      date: '2024-06-10',
      location: 'Apollo Hospital',
      batchNo: 'HEP202406010',
      status: 'Completed',
      nextDue: null,
      type: 'Series Complete'
    },
    {
      id: 4,
      vaccine: 'Tetanus-Diphtheria (Td)',
      date: '2023-05-15',
      location: 'Fortis Hospital',
      batchNo: 'TD202305150',
      status: 'Completed',
      nextDue: '2033-05-15',
      type: '10-year'
    },
    {
      id: 5,
      vaccine: 'HPV Vaccine (2nd Dose)',
      date: '2023-02-20',
      location: 'Safdarjung Hospital',
      batchNo: 'HPV202302200',
      status: 'Completed',
      nextDue: '2024-10-20',
      type: 'Series'
    }
  ];

  const upcomingVaccines = [
    {
      vaccine: 'HPV Vaccine (3rd Dose)',
      dueDate: '2024-10-20',
      priority: 'High',
      description: 'Final dose in HPV vaccine series'
    },
    {
      vaccine: 'COVID-19 Annual Booster',
      dueDate: '2025-02-15',
      priority: 'Medium',
      description: 'Annual COVID-19 booster recommended'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return { variant: 'default' as const, icon: CheckCircle, color: 'text-success' };
      case 'Overdue':
        return { variant: 'destructive' as const, icon: AlertCircle, color: 'text-destructive' };
      case 'Due Soon':
        return { variant: 'secondary' as const, icon: Clock, color: 'text-warning' };
      default:
        return { variant: 'secondary' as const, icon: Shield, color: 'text-muted-foreground' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-destructive';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="card-soft text-center p-4">
          <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">{immunizations.length}</div>
          <div className="text-sm text-muted-foreground">Total Vaccines</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-success">{immunizations.filter(i => i.status === 'Completed').length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-warning">{upcomingVaccines.length}</div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </Card>
      </div>

      {/* Upcoming Vaccines */}
      {upcomingVaccines.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 text-warning" size={20} />
            Upcoming Vaccines
          </h2>
          <div className="space-y-3">
            {upcomingVaccines.map((vaccine, index) => (
              <Card key={index} className="card-soft p-4 border-l-4 border-l-warning">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{vaccine.vaccine}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{vaccine.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {vaccine.dueDate}
                      </span>
                      <span className={`font-medium ${getPriorityColor(vaccine.priority)}`}>
                        {vaccine.priority} Priority
                      </span>
                    </div>
                  </div>
                  <Button className="btn-capsule">
                    Schedule
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Immunization History */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="mr-2 text-primary" size={20} />
          Vaccination History
        </h2>
        <div className="space-y-4">
          {immunizations.map((immunization) => {
            const statusConfig = getStatusConfig(immunization.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={immunization.id} className="card-soft p-4">
                {/* Immunization Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{immunization.vaccine}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {immunization.date}
                    </p>
                  </div>
                  <Badge variant={statusConfig.variant} className="flex items-center">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {immunization.status}
                  </Badge>
                </div>

                {/* Immunization Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">VACCINATION SITE</span>
                      <p className="text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {immunization.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">BATCH NUMBER</span>
                      <p className="text-sm font-mono">{immunization.batchNo}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">TYPE</span>
                      <p className="text-sm">{immunization.type}</p>
                    </div>
                    {immunization.nextDue && (
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">NEXT DUE</span>
                        <p className="text-sm">{immunization.nextDue}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="btn-capsule">
                    View Certificate
                  </Button>
                  <Button size="sm" variant="outline" className="btn-capsule">
                    Download QR
                  </Button>
                  {immunization.nextDue && (
                    <Button size="sm" className="btn-capsule">
                      Schedule Next
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Immunization;