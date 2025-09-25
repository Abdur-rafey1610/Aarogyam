import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Stethoscope, FileText, Calendar, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentVisits = () => {
  const navigate = useNavigate();

  const visits = [
    {
      id: 1,
      doctor: 'Dr. Priya Sharma',
      specialty: 'General Medicine',
      hospital: 'AIIMS Delhi',
      date: '2024-09-16',
      time: '10:30 AM',
      status: 'Follow-up required',
      diagnosis: 'Viral Fever',
      prescription: 'Paracetamol 500mg, Rest',
      nextVisit: '2024-09-23',
      notes: 'Patient showing improvement. Continue medication and rest.'
    },
    {
      id: 2,
      doctor: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      hospital: 'Max Healthcare',
      date: '2024-09-10',
      time: '2:15 PM',
      status: 'Completed',
      diagnosis: 'Hypertension monitoring',
      prescription: 'Amlodipine 5mg daily',
      nextVisit: '2024-10-10',
      notes: 'Blood pressure under control. Regular monitoring advised.'
    },
    {
      id: 3,
      doctor: 'Dr. Sunita Verma',
      specialty: 'Dermatology',
      hospital: 'Apollo Hospital',
      date: '2024-09-05',
      time: '11:00 AM',
      status: 'Completed',
      diagnosis: 'Allergic dermatitis',
      prescription: 'Antihistamine, Moisturizer',
      nextVisit: '2024-09-19',
      notes: 'Skin condition improving. Avoid known allergens.'
    },
    {
      id: 4,
      doctor: 'Dr. Amit Patel',
      specialty: 'Orthopedics',
      hospital: 'Fortis Hospital',
      date: '2024-08-28',
      time: '9:45 AM',
      status: 'Completed',
      diagnosis: 'Lower back pain',
      prescription: 'Physiotherapy sessions',
      nextVisit: '2024-09-25',
      notes: 'Continue exercises. Significant improvement noted.'
    },
    {
      id: 5,
      doctor: 'Dr. Kavita Singh',
      specialty: 'Pediatrics',
      hospital: 'Safdarjung Hospital',
      date: '2024-08-20',
      time: '4:00 PM',
      status: 'Completed',
      diagnosis: 'Routine checkup',
      prescription: 'Vitamin D supplements',
      nextVisit: '2024-11-20',
      notes: 'Child is healthy. Continue regular diet and exercise.'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'Completed' ? 'default' : 'secondary';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white p-2 hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Recent Visits</h1>
        </div>
        <p className="opacity-90">Your medical consultation history</p>
      </div>

      <div className="p-6">
        {/* Visits List */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {visits.map((visit) => (
            <AccordionItem key={visit.id} value={`item-${visit.id}`} className="card-soft px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="text-white" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-md md:text-lg">{visit.doctor}</h3>
                      <p className="text-sm text-muted-foreground">{visit.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium whitespace-nowrap">{visit.date}</p>
                    <Badge variant={getStatusColor(visit.status)} className="text-xs mt-1">
                      {visit.status}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {/* Visit Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-4 border-t pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <span>{visit.hospital}</span>
                    </div>
                    <div className="flex items-start space-x-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <span>{visit.date} at {visit.time}</span>
                    </div>
                    {visit.nextVisit && (
                      <div className="flex items-start space-x-3 text-sm">
                        <Calendar className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Next Visit: {visit.nextVisit}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">DIAGNOSIS</span>
                      <p className="text-sm">{visit.diagnosis}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">PRESCRIPTION</span>
                      <p className="text-sm">{visit.prescription}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor's Notes */}
                <div className="border-t pt-4 mb-4">
                  <span className="text-xs font-semibold text-muted-foreground">DOCTOR'S NOTES</span>
                  <p className="text-sm text-muted-foreground mt-1">{visit.notes}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="btn-capsule">
                    <FileText className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                  <Button size="sm" variant="outline" className="btn-capsule">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Doctor
                  </Button>
                  <Button size="sm" className="btn-capsule btn-primary">
                    Book Follow-up
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default RecentVisits;