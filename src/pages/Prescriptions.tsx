import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const Prescriptions = () => {
  const prescriptions = [
    {
      id: 1,
      doctor: 'Dr. Priya Sharma',
      date: '2024-09-16',
      status: 'Active',
      medications: [
        {
          name: 'Paracetamol 500mg',
          dosage: '1 tablet',
          frequency: 'Twice daily',
          duration: '5 days',
          instructions: 'After meals',
          remaining: 3
        },
        {
          name: 'Cetirizine 10mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '7 days',
          instructions: 'Before bedtime',
          remaining: 5
        }
      ]
    },
    {
      id: 2,
      doctor: 'Dr. Rajesh Kumar',
      date: '2024-09-10',
      status: 'Active',
      medications: [
        {
          name: 'Amlodipine 5mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: 'Ongoing',
          instructions: 'Morning, with water',
          remaining: 25
        }
      ]
    },
    {
      id: 3,
      doctor: 'Dr. Sunita Verma',
      date: '2024-09-05',
      status: 'Completed',
      medications: [
        {
          name: 'Hydrocortisone Cream',
          dosage: 'Apply thin layer',
          frequency: 'Twice daily',
          duration: '10 days',
          instructions: 'On affected area only',
          remaining: 0
        },
        {
          name: 'Loratadine 10mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '15 days',
          instructions: 'With or without food',
          remaining: 0
        }
      ]
    },
    {
      id: 4,
      doctor: 'Dr. Amit Patel',
      date: '2024-08-28',
      status: 'Active',
      medications: [
        {
          name: 'Ibuprofen 400mg',
          dosage: '1 tablet',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'After meals only',
          remaining: 12
        },
        {
          name: 'Calcium + Vitamin D3',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'With breakfast',
          remaining: 18
        }
      ]
    },
    {
      id: 5,
      doctor: 'Dr. Kavita Singh',
      date: '2024-08-20',
      status: 'Completed',
      medications: [
        {
          name: 'Vitamin D3 1000 IU',
          dosage: '1 capsule',
          frequency: 'Once weekly',
          duration: '12 weeks',
          instructions: 'With milk or after meal',
          remaining: 0
        }
      ]
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Active':
        return { variant: 'default' as const, color: 'text-success', icon: CheckCircle };
      case 'Completed':
        return { variant: 'secondary' as const, color: 'text-muted-foreground', icon: CheckCircle };
      case 'Expired':
        return { variant: 'destructive' as const, color: 'text-destructive', icon: AlertCircle };
      default:
        return { variant: 'secondary' as const, color: 'text-muted-foreground', icon: Clock };
    }
  };

  const getMedicationStatus = (remaining: number, duration: string) => {
    if (remaining === 0) return { text: 'Completed', color: 'text-muted-foreground' };
    if (remaining <= 3) return { text: 'Running Low', color: 'text-warning' };
    if (duration === 'Ongoing') return { text: 'Chronic', color: 'text-primary' };
    return { text: 'Active', color: 'text-success' };
  };

  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="card-soft text-center p-4">
          <Pill className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'Active').length}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-warning">
            {prescriptions.reduce((acc, p) => acc + p.medications.filter(m => m.remaining <= 3 && m.remaining > 0).length, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Running Low</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-success">{prescriptions.filter(p => p.status === 'Completed').length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
      </div>

      {/* Prescriptions List */}
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
        {prescriptions.map((prescription) => {
          const statusConfig = getStatusConfig(prescription.status);
          const StatusIcon = statusConfig.icon;

          return (
            <AccordionItem key={prescription.id} value={`item-${prescription.id}`} className="card-soft px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <h3 className="font-semibold text-md">Prescription from {prescription.doctor}</h3>
                    <p className="text-sm text-muted-foreground">{prescription.date}</p>
                  </div>
                  <Badge variant={statusConfig.variant} className="flex items-center ml-4">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {prescription.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {/* Medications */}
                <div className="space-y-3 mb-4 border-t pt-4">
                  <h4 className="font-medium text-sm">Medications:</h4>
                  {prescription.medications.map((med, idx) => {
                    const medStatus = getMedicationStatus(med.remaining, med.duration);
                    return (
                      <div key={idx} className="p-4 bg-background rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-semibold">{med.name}</h5>
                            <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${medStatus.color}`}>{medStatus.text}</div>
                            {med.remaining > 0 && <div className="text-xs text-muted-foreground">{med.remaining} days left</div>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground">DURATION</span>
                            <p>{med.duration}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">INSTRUCTIONS</span>
                            <p>{med.instructions}</p>
                          </div>
                        </div>
                        {med.duration !== 'Ongoing' && med.remaining > 0 && (
                          <div className="mt-3">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.max(10, (med.remaining / 30) * 100)}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="btn-capsule"><Clock className="w-4 h-4 mr-2" />Set Reminder</Button>
                  <Button size="sm" variant="outline" className="btn-capsule">Refill Request</Button>
                  <Button size="sm" className="btn-capsule btn-primary">Contact Doctor</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Prescriptions;