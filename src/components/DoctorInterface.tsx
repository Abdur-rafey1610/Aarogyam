import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, QrCode, Nfc, User, Clock, FileText, 
  Stethoscope, Heart, Activity, Phone, Mail 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "./QRScanner";

const DoctorInterface = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { toast } = useToast();

  const recentPatients = [
    {
      id: 1,
      name: "Aarav Patel",
      abhaId: "14-1234-5678-9012",
      age: 28,
      gender: "Male",
      phone: "+91 98765 43210",
      lastVisit: "2 days ago",
      condition: "Hypertension monitoring",
      urgency: "routine"
    },
    {
      id: 2,
      name: "Priya Sharma",
      abhaId: "14-2345-6789-0123",
      age: 34,
      gender: "Female",
      phone: "+91 87654 32109",
      lastVisit: "5 days ago",
      condition: "Diabetes follow-up",
      urgency: "follow-up"
    },
    {
      id: 3,
      name: "Ramesh Kumar",
      abhaId: "14-3456-7890-1234",
      age: 52,
      gender: "Male",
      phone: "+91 76543 21098",
      lastVisit: "1 week ago",
      condition: "Chest pain evaluation",
      urgency: "urgent"
    }
  ];

  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const handleNFCScan = async () => {
    console.log('NFC Scan initiated...');
    
    // Check if we're in development mode (localhost or local network)
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.startsWith('192.168.') ||
                         window.location.hostname.startsWith('10.0.');

    // Enhanced device and browser detection
    const isAndroid = /android/i.test(navigator.userAgent);
    const isChrome = /chrome|chromium|crios/i.test(navigator.userAgent);
    const chromeVersion = (navigator.userAgent.match(/Chrome\/(\d+)/) || [])[1] || 'unknown';
    const isSecure = window.isSecureContext;
    const hasNDEF = 'NDEFReader' in window;
    
    // Additional NFC detection
    const hasNFC = 'nfc' in navigator;
    const hasWebNFC = 'NDEFReader' in window;
    const isChromeForAndroid = isAndroid && isChrome && parseInt(chromeVersion, 10) >= 89;
    
    // Log detailed NFC capabilities
    console.log('NFC Capabilities:', {
      hasNFC,
      hasWebNFC,
      isChromeForAndroid,
      chromeVersion,
      isSecure,
      userAgent: navigator.userAgent
    });

    // Log detailed environment info for debugging
    const envInfo = {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      isDevelopment,
      userAgent: navigator.userAgent,
      isAndroid,
      isChrome,
      chromeVersion,
      hasNDEFReader: hasNDEF,
      isSecureContext: isSecure,
      nfcPermission: 'nfc' in navigator ? 'available' : 'not available',
      permissionsApi: 'permissions' in navigator ? 'available' : 'not available'
    };
    
    console.log('NFC Environment Info:', envInfo);

    // Check for common issues and provide specific guidance
    if (!isAndroid) {
      toast({
        title: "Device Not Supported",
        description: "Web NFC is currently only supported on Android devices with Chrome 89+.",
        variant: "destructive",
      });
      return;
    }

    if (!isChrome) {
      toast({
        title: "Browser Not Supported",
        description: "Please use Chrome for Android to access NFC features.",
        variant: "destructive",
      });
      return;
    }

    if (!isSecure && !isDevelopment) {
      toast({
        title: "Security Restriction",
        description: "NFC requires a secure (HTTPS) connection in production.",
        variant: "destructive",
      });
      return;
    }

    // Check for Web NFC support
    if (!hasNDEF) {
      // Try to detect if this is a Chrome version that should support NFC
      const chromeVerNum = parseInt(chromeVersion, 10);
      const shouldSupportNFC = chromeVerNum >= 89;
      
      let errorMessage = "Web NFC is not available on this device.";
      
      if (shouldSupportNFC) {
        errorMessage = "Your Chrome version should support NFC, but the feature appears to be disabled. " +
                     "Try updating Chrome or enabling Chrome flags for Web NFC.";
      } else {
        errorMessage = `Web NFC requires Chrome 89 or later. Your version: ${chromeVersion}`;
      }
      
      console.error('NFC Error:', errorMessage, envInfo);
      
      toast({
        title: "Web NFC Not Available",
        description: (
          <div className="space-y-2">
            <p>Your device doesn't support Web NFC or it's not enabled at the system level.</p>
            <div className="text-sm space-y-2">
              <p>This could be because:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your device doesn't have NFC hardware</li>
                <li>NFC is disabled in your device settings</li>
                <li>Your device manufacturer has disabled Web NFC</li>
              </ul>
              <p className="mt-2">To use NFC features, you'll need an Android device with NFC hardware and Chrome 89+.</p>
            </div>
          </div>
        ),
        variant: "destructive",
        action: (
          <button 
            onClick={() => window.open('https://caniuse.com/webnfc', '_blank')}
            className="text-white hover:underline text-sm bg-blue-600 px-3 py-1 rounded"
          >
            Check Device Compatibility
          </button>
        )
      });
      return;
    }

    try {
      // Request NFC permissions
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'nfc' as any });
          if (permissionStatus.state === 'denied') {
            throw new Error('NFC permission denied');
          }
        } catch (error) {
          console.warn('NFC permission query not supported, continuing...');
        }
      }

      const ndef = new (window as any).NDEFReader();
      
      // Show scanning started message
      toast({
        title: "Ready to Scan",
        description: "Hold the NFC card or device near the back of your phone.",
        duration: 5000,
      });

      // Start scanning with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('NFC scan timed out after 30 seconds')), 30000)
      );

      await Promise.race([
        ndef.scan(),
        timeoutPromise
      ]);

      // Set up reading handler
      ndef.onreading = (event: any) => {
        console.log("NFC message read:", event);
        
        // Process the NFC message - assuming it contains a URL with patient ID
        const decoder = new TextDecoder();
        let patientId = '';
        
        // Try to get the first text record
        for (const record of event.message.records) {
          if (record.recordType === 'text') {
            patientId = decoder.decode(record.data);
            break;
          } else if (record.recordType === 'url') {
            const url = decoder.decode(record.data);
            // Extract patient ID from URL if it exists
            const match = url.match(/patient[_-]?id=([^&]+)/i);
            if (match) {
              patientId = match[1];
              break;
            }
          }
        }

        if (patientId) {
          toast({
            title: "Patient Found",
            description: `Successfully scanned patient ID: ${patientId}`,
          });
          // TODO: Navigate to patient record or update UI
        } else {
          toast({
            title: "Invalid Card",
            description: "The scanned NFC card doesn't contain valid patient information.",
            variant: "destructive",
          });
        }
      };

      // Handle reading errors
      ndef.onreadingerror = (error: any) => {
        console.error("NFC Read Error:", error);
        toast({
          title: "Scan Failed",
          description: "Could not read the NFC card. Please try again.",
          variant: "destructive",
        });
      };

    } catch (error: any) {
      console.error("NFC Error:", error);
      
      let errorMessage = "Could not start NFC scanning.";
      
      if (error.name === 'NotAllowedError' || error.message.includes('permission')) {
        errorMessage = "NFC permission was denied. Please allow NFC access in your browser settings.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "NFC scan timed out. Please try again.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "NFC is not supported by your device or browser.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Cannot access the NFC adapter. Please ensure no other app is using NFC.";
      }
      
      toast({
        title: "NFC Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    toast({
      title: "Patient Profile Loaded",
      description: `Accessing health records for ${patient.name}`,
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'follow-up': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-primary text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Dr. Kavitha Reddy</h1>
            <p className="opacity-90">General Medicine • Apollo Hospital</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm opacity-90">Patients Today</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Find Patient</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by ABHA ID, Name, or Phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg rounded-capsule"
            />
          </div>

          {/* Scan Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full btn-capsule btn-primary py-6 text-lg">
                  <QrCode className="mr-3" size={24} />
                  Scan Patient ID
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={handleScanQR} className="py-3">
                  <QrCode className="mr-3" size={20} />
                  <span>Scan QR Code</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleNFCScan} className="py-3">
                  <Nfc className="mr-3" size={20} />
                  <span>Scan NFC Card</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="w-full btn-capsule py-6 text-lg" onClick={() => navigate('/view-record/doctor/95026127911610')}>
              <FileText className="mr-3" size={24} />
              Test Record
            </Button>
          </div>
        </section>

        {/* Recent Patients */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2 text-primary" size={24} />
            Recent Patients
          </h2>
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <Card 
                key={patient.id} 
                className="card-soft p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary/20 rounded-full flex items-center justify-center">
                      <User className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ABHA: {patient.abhaId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">{patient.lastVisit}</div>
                    <Badge variant={getUrgencyColor(patient.urgency)} className="text-xs">
                      {patient.condition}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Patient Summary (if selected) */}
        {selectedPatient && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-success" size={24} />
              Patient Summary - {selectedPatient.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Demographics */}
              <Card className="card-gradient p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="mr-2" size={18} />
                  Demographics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span>{selectedPatient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender:</span>
                    <span>{selectedPatient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-mono">{selectedPatient.phone}</span>
                  </div>
                </div>
              </Card>

              {/* Vitals */}
              <Card className="card-gradient p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Activity className="mr-2" size={18} />
                  Recent Vitals
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BP:</span>
                    <span>140/90 mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heart Rate:</span>
                    <span>72 bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>68 kg</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="btn-capsule btn-primary">
                <Stethoscope className="mr-2" size={18} />
                Start Consultation
              </Button>
              <Button variant="outline" className="btn-capsule">
                <FileText className="mr-2" size={18} />
                View Full Records
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 z-50 bg-background">
          <QRScanner onClose={() => setShowQRScanner(false)} showNfcButton={false} />
        </div>
      )}
    </div>
  );
};

export default DoctorInterface;