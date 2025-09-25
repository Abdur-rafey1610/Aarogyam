import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Heart, Stethoscope, FileText, FlaskConical, Pill, Clock, Edit, Save, Calendar, Microscope, AlertTriangle } from "lucide-react";
import patientAvatar from "@/assets/IMG-20250920-WA0004[1].jpg";

// --- Mock Data ---
const patientData = {
  name: "Mohammed Abdur Rafey",
  age: 19,
  abhaId: "9502-6127-9116-10",
  avatarUrl: patientAvatar,
  vitals: {
    height: "175 cm",
    weight: "68 kg",
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6°F",
  },
  allergies: [
    { name: "Pollen", severity: "Mild", on: "2022-03-10" },
    { name: "Dust Mites", severity: "Moderate", on: "2021-09-15" },
  ],
  activeMedications: [
    { name: "Cetirizine", dosage: "10mg", frequency: "Once daily for allergies" },
  ],
  emergencyInfo: {
    medications: "Epinephrine Auto-Injector (EpiPen) for severe allergic reactions.",
    notes: "Patient has a severe allergy to peanuts. In case of accidental exposure, administer EpiPen immediately and call emergency services. Patient also has mild pollen and dust mite allergies."
  },
  recentVisits: [
    { date: "2024-08-15", doctor: "Dr. Ananya Sharma", reason: "Seasonal Allergies", summary: "Prescribed Cetirizine for allergy symptoms. Advised to avoid outdoor activities during high pollen counts." },
    { date: "2024-01-20", doctor: "Dr. Vikram Singh", reason: "Annual Check-up", summary: "Routine physical examination. All vitals are normal. Blood work clear." },
  ],
  labReports: [
    { date: "2024-01-20", name: "Complete Blood Count (CBC)", status: "Normal" },
    { date: "2024-01-20", name: "Lipid Profile", status: "Normal" },
  ],
  pastRecords: [
    {
      date: "2023-05-10",
      doctor: "Dr. Priya Desai",
      hospital: "City General Hospital",
      reason: "Viral Fever",
      summary: "Patient presented with high fever, body aches, and fatigue. Diagnosed with viral fever. Prescribed Paracetamol and advised rest and hydration. Full recovery reported in a week.",
      prescription: "Paracetamol 500mg (1 tab, 3 times a day for 3 days)",
    },
    {
      date: "2022-11-22",
      doctor: "Dr. Rajesh Mehta",
      hospital: "Community Clinic",
      reason: "Minor Sports Injury",
      summary: "Sustained a minor sprain in the left ankle during a football match. X-ray showed no fracture. Advised R.I.C.E (Rest, Ice, Compression, Elevation) and prescribed a topical anti-inflammatory gel.",
      prescription: "Topical Diclofenac Gel (Apply twice daily)",
    },
  ],
  newRecords: []
};

// --- Helper Components ---
const InfoPill = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
    <Icon className="w-6 h-6 text-primary" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const RecordSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <Card className="card-soft">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

// --- Main Component ---
const ViewRecord = () => {
  const { userType, abhaId } = useParams<{ userType: 'doctor' | 'citizen', abhaId: string }>();
  console.log('ViewRecord component rendered with userType:', userType, 'and abhaId:', abhaId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [currentPatientData, setCurrentPatientData] = useState(patientData);
  const [newRecord, setNewRecord] = useState({
    symptoms: "",
    observation: "",
    medication: "",
    note: "",
  });

  useEffect(() => {
    const sessionEndKey = 'viewRecordSessionEnd';
    let sessionEnd = localStorage.getItem(sessionEndKey);

    if (!sessionEnd || Date.now() > parseInt(sessionEnd, 10)) {
      const newSessionEnd = Date.now() + 5 * 60 * 1000;
      localStorage.setItem(sessionEndKey, newSessionEnd.toString());
      sessionEnd = newSessionEnd.toString();
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((parseInt(sessionEnd!, 10) - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        localStorage.removeItem(sessionEndKey);
        toast({
          title: 'Session Expired',
          description: 'Your access to this health record has ended.',
          variant: 'destructive',
        });
        navigate('/'); // Navigate to a safe, public page
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, toast]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRecord = () => {
    const newVisit = {
      date: new Date().toISOString().split('T')[0],
      doctor: "Dr. Kavitha Reddy", // Assuming the doctor's name from context
      reason: "New Consultation",
      summary: `Symptoms: ${newRecord.symptoms}. Observation: ${newRecord.observation}. Note: ${newRecord.note}`,
    };

    const newPrescription = {
        name: newRecord.medication.split('(')[0].trim(),
        dosage: newRecord.medication.split('(')[1]?.split(')')[0] || '',
        frequency: newRecord.medication.split(')')[1]?.trim() || ''
    }

    // Update the state to reflect the new record
    setCurrentPatientData(prev => ({
      ...prev,
      recentVisits: [newVisit, ...prev.recentVisits],
      activeMedications: newPrescription.name ? [newPrescription, ...prev.activeMedications] : prev.activeMedications
    }));

    toast({
      title: "Record Submitted",
      description: "The new medical record has been added successfully.",
    });

    // Clear form and end session
    setNewRecord({ symptoms: "", observation: "", medication: "", note: "" });
    localStorage.removeItem('viewRecordSessionEnd');
    toast({
      title: 'Session Ended',
      description: 'The consultation has been submitted and the session is now closed.',
    });
    navigate('/doctor-interface'); // Navigate back to doctor's dashboard
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white p-2 hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">Health Record</h1>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium">
            <Clock size={16} />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4 -mt-12">
        <Card className="p-4 flex flex-col items-center text-center card-soft shadow-lg">
          <Avatar className="w-24 h-24 mb-3 border-4 border-primary/50 ring-4 ring-primary/20">
            <AvatarImage src={patientData.avatarUrl} alt={patientData.name} />
            <AvatarFallback>{patientData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{patientData.name}</h2>
          <p className="text-muted-foreground">ABHA ID: {patientData.abhaId}</p>
          <Badge variant={userType === 'doctor' ? 'destructive' : 'secondary'} className="mt-2 capitalize">
            {userType} Access
          </Badge>
        </Card>
      </div>

      {/* Records */}
      <div className="p-4">
        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className={`grid w-full ${userType === 'doctor' ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="active">Active Record</TabsTrigger>
            <TabsTrigger value="past">Past Records</TabsTrigger>
            {userType === 'doctor' && <TabsTrigger value="new-prescription">New Prescription</TabsTrigger>}
          </TabsList>
          <TabsContent value="emergency">
            <div className="space-y-4 mt-4">
              <RecordSection icon={AlertTriangle} title="Emergency Information">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">Emergency Medications</h4>
                    <p className="text-sm bg-destructive/10 p-3 rounded-lg">{currentPatientData.emergencyInfo.medications}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">Critical Notes</h4>
                    <p className="text-sm bg-destructive/10 p-3 rounded-lg">{currentPatientData.emergencyInfo.notes}</p>
                  </div>
                </div>
              </RecordSection>
            </div>
          </TabsContent>
          <TabsContent value="active">
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoPill icon={User} label="Age" value={`${patientData.age} years`} />
                <InfoPill icon={Heart} label="Blood Pressure" value={patientData.vitals.bloodPressure} />
              </div>

              {/* Citizen View */}
              {userType === 'citizen' && (
                <div className="space-y-6">
                  <RecordSection icon={Pill} title="Active Medications">
                    {patientData.activeMedications.map((med, i) => <p key={i} className="text-sm">{med.name} ({med.dosage}) - {med.frequency}</p>)}
                  </RecordSection>
                  <RecordSection icon={Stethoscope} title="Recent Visits">
                    {patientData.recentVisits.slice(0, 1).map((visit, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-semibold">{visit.date} with {visit.doctor}</p>
                        <p className="text-muted-foreground">{visit.summary}</p>
                      </div>
                    ))}
                  </RecordSection>
                </div>
              )}

              {/* Doctor View */}
              {userType === 'doctor' && (
                <div className="space-y-6">
                  <RecordSection icon={Heart} title="Vitals">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <p><strong>Height:</strong> {patientData.vitals.height}</p>
                      <p><strong>Weight:</strong> {patientData.vitals.weight}</p>
                      <p><strong>Heart Rate:</strong> {patientData.vitals.heartRate}</p>
                      <p><strong>Temp:</strong> {patientData.vitals.temperature}</p>
                    </div>
                  </RecordSection>

                  <RecordSection icon={FileText} title="Allergies">
                    {patientData.allergies.map((allergy, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <p>{allergy.name} <Badge variant="outline">{allergy.severity}</Badge></p>
                        <p className="text-muted-foreground">Since {allergy.on}</p>
                      </div>
                    ))}
                  </RecordSection>

                  <RecordSection icon={FlaskConical} title="Lab Reports">
                    {patientData.labReports.map((report, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <p>{report.name} ({report.date})</p>
                        <Badge variant={report.status === 'Normal' ? 'secondary' : 'destructive'}>{report.status}</Badge>
                      </div>
                    ))}
                  </RecordSection>

                  <RecordSection icon={Stethoscope} title="Consultation History">
                    {patientData.recentVisits.map((visit, i) => (
                      <div key={i} className="text-sm border-b pb-2 last:border-0">
                        <p className="font-semibold">{visit.date} - {visit.reason}</p>
                        <p className="text-xs text-muted-foreground">with {visit.doctor}</p>
                        <p className="mt-1">{visit.summary}</p>
                      </div>
                    ))}
                  </RecordSection>
                  
                                  </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="space-y-4 mt-4">
              {patientData.pastRecords.map((record, i) => (
                <Card key={i} className="card-soft p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{record.reason}</p>
                      <p className="text-sm text-muted-foreground">{record.hospital}</p>
                    </div>
                    <Badge variant="outline">{record.date}</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="text-sm space-y-2">
                    <p><strong className="text-primary">Doctor:</strong> {record.doctor}</p>
                    <p><strong className="text-primary">Summary:</strong> {record.summary}</p>
                    <p><strong className="text-primary">Prescription:</strong> {record.prescription}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          {userType === 'doctor' && (
            <TabsContent value="new-prescription">
              <div className="space-y-4 mt-4">
                <Card className="card-soft p-4">
                  <CardHeader className="p-2">
                    <CardTitle className="text-lg">New Medical Record</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-2">
                    <div className="space-y-2">
                      <label htmlFor="symptoms" className="text-sm font-medium">Symptoms</label>
                      <Textarea id="symptoms" name="symptoms" placeholder="e.g., Fever, headache, sore throat..." value={newRecord.symptoms} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="observation" className="text-sm font-medium">Observation</label>
                      <Textarea id="observation" name="observation" placeholder="e.g., Patient appears fatigued, mild swelling..." value={newRecord.observation} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="medication" className="text-sm font-medium">Medication</label>
                      <Textarea id="medication" name="medication" placeholder="e.g., Paracetamol 500mg (1-1-1) for 3 days..." value={newRecord.medication} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="note" className="text-sm font-medium">Additional Notes</label>
                      <Textarea id="note" name="note" placeholder="e.g., Advised bed rest and hydration..." value={newRecord.note} onChange={handleInputChange} />
                    </div>
                    <Button className="w-full mt-4" onClick={handleSubmitRecord}>
                      <Save className="w-4 h-4 mr-2" />
                      Submit Record & End Session
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ViewRecord;