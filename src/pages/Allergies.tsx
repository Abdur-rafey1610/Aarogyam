import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Calendar, Stethoscope } from "lucide-react";

const Allergies = () => {
  const allergies = [
    {
      id: 1,
      allergen: 'Peanuts',
      severity: 'Severe',
      reaction: 'Anaphylaxis, difficulty breathing, swelling',
      dateIdentified: '2020-03-15',
      doctor: 'Dr. Sunita Verma',
      notes: 'Carry epinephrine auto-injector at all times',
      category: 'Food'
    },
    {
      id: 2,
      allergen: 'Penicillin',
      severity: 'Moderate',
      reaction: 'Skin rash, itching, hives',
      dateIdentified: '2019-07-22',
      doctor: 'Dr. Priya Sharma',
      notes: 'Use alternative antibiotics like cephalexin',
      category: 'Medication'
    },
    {
      id: 3,
      allergen: 'Dust Mites',
      severity: 'Mild',
      reaction: 'Sneezing, runny nose, watery eyes',
      dateIdentified: '2018-11-10',
      doctor: 'Dr. Rajesh Kumar',
      notes: 'Use air purifier and hypoallergenic bedding',
      category: 'Environmental'
    },
    {
      id: 4,
      allergen: 'Latex',
      severity: 'Moderate',
      reaction: 'Contact dermatitis, skin irritation',
      dateIdentified: '2021-05-08',
      doctor: 'Dr. Amit Patel',
      notes: 'Inform medical staff before procedures',
      category: 'Contact'
    },
    {
      id: 5,
      allergen: 'Shellfish',
      severity: 'Severe',
      reaction: 'Swelling, difficulty swallowing, nausea',
      dateIdentified: '2019-12-03',
      doctor: 'Dr. Kavita Singh',
      notes: 'Avoid all shellfish and cross-contaminated foods',
      category: 'Food'
    }
  ];

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'Severe':
        return { 
          variant: 'destructive' as const, 
          color: 'text-destructive',
          bgColor: 'bg-destructive/10'
        };
      case 'Moderate':
        return { 
          variant: 'secondary' as const, 
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      case 'Mild':
        return { 
          variant: 'outline' as const, 
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      default:
        return { 
          variant: 'secondary' as const, 
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10'
        };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Food':
        return 'bg-primary/10 text-primary';
      case 'Medication':
        return 'bg-destructive/10 text-destructive';
      case 'Environmental':
        return 'bg-success/10 text-success';
      case 'Contact':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div>
      {/* Alert Banner */}
      <Card className="bg-destructive/10 border-destructive/20 mb-6 p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="text-destructive" size={24} />
          <div>
            <h3 className="font-semibold text-destructive">Emergency Alert</h3>
            <p className="text-sm text-destructive/80">
              Always inform healthcare providers about your allergies before any treatment or procedure.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold">{allergies.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-destructive">
            {allergies.filter(a => a.severity === 'Severe').length}
          </div>
          <div className="text-sm text-muted-foreground">Severe</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-warning">
            {allergies.filter(a => a.severity === 'Moderate').length}
          </div>
          <div className="text-sm text-muted-foreground">Moderate</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-success">
            {allergies.filter(a => a.severity === 'Mild').length}
          </div>
          <div className="text-sm text-muted-foreground">Mild</div>
        </Card>
      </div>

      {/* Allergies List */}
      <div className="space-y-4">
        {allergies.map((allergy) => {
          const severityConfig = getSeverityConfig(allergy.severity);
          
          return (
            <Card key={allergy.id} className={`card-soft p-4 ${severityConfig.bgColor} border-l-4 border-l-current`}>
              {/* Allergy Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-xl">{allergy.allergen}</h3>
                    <Badge className={getCategoryColor(allergy.category)}>
                      {allergy.category}
                    </Badge>
                  </div>
                  <Badge variant={severityConfig.variant} className="mb-2">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {allergy.severity} Severity
                  </Badge>
                </div>
              </div>

              {/* Reaction Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Typical Reaction:</h4>
                  <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">Medical Notes:</h4>
                  <p className="text-sm text-muted-foreground">{allergy.notes}</p>
                </div>
              </div>

              {/* Medical Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-border/50">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">IDENTIFIED BY</span>
                  <p className="text-sm flex items-center">
                    <Stethoscope className="w-4 h-4 mr-1" />
                    {allergy.doctor}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">DATE IDENTIFIED</span>
                  <p className="text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {allergy.dateIdentified}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="btn-capsule">
                  Edit Details
                </Button>
                <Button size="sm" variant="outline" className="btn-capsule">
                  Emergency Card
                </Button>
                <Button size="sm" className="btn-capsule">
                  Share with Doctor
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Emergency Contact Info */}
      <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
        <h3 className="font-semibold mb-2">Emergency Information</h3>
        <p className="text-sm text-muted-foreground mb-2">
          In case of severe allergic reaction, call emergency services immediately.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="btn-capsule">
            Emergency Contacts
          </Button>
          <Button size="sm" className="btn-capsule">
            Download Alert Card
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Allergies;