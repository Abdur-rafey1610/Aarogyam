import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { 
  QrCode, FileText, Heart, Shield, CalendarDays, 
  User, MapPin, Phone, Mail, Stethoscope, Pill, Activity,
  Camera, AlertTriangle, Users, Radio, Smartphone, SmartphoneNfc
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "./BottomNavigation";
import QRModal from "./QRModal";
import QRScanner from "./QRScanner";
import { useToast } from "@/hooks/use-toast";
import { type CarouselApi } from "@/components/ui/carousel"

const PatientDashboard = () => {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


  const healthRecords = [
    { type: 'Prescriptions', count: 8, icon: Pill, color: 'text-secondary', path: '/prescriptions' },
    { type: 'Lab Reports', count: 5, icon: Activity, color: 'text-primary', path: '/lab-reports' },
    { type: 'Immunization', count: 12, icon: Shield, color: 'text-success', path: '/immunization' },
    { type: 'Allergies', count: 5, icon: AlertTriangle, color: 'text-destructive', path: '/allergies' }
  ];

  // Handle NFC scanning for viewing others' records
  const handleNFCScan = async () => {
    console.log('NFC Scan initiated from Patient Dashboard...');
    
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
    console.log('NFC Capabilities (Patient):', {
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
    
    console.log('NFC Environment Info (Patient):', envInfo);

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
      
      console.error('NFC Error (Patient):', errorMessage, envInfo);
      
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
        description: "Hold the NFC card or device near the back of your phone to view records.",
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
            title: "Records Found",
            description: `Accessing health records for the scanned profile.`,
          });
          // Navigate to view the record with the scanned ID
          navigate(`/view-record/doctor/${patientId}`);
        } else {
          toast({
            title: "Invalid Card",
            description: "The scanned NFC card doesn't contain valid health information.",
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

  const quickActions = [
    { 
      title: 'Scan NFC Card', 
      icon: SmartphoneNfc, 
      color: 'text-primary',
      action: handleNFCScan
    },
    { 
      title: 'Scan QR Code', 
      icon: QrCode, 
      color: 'text-secondary',
      action: () => setShowQRScanner(true)
    },
    { 
      title: 'Family Management', 
      icon: Users, 
      color: 'text-success',
      action: () => navigate('/family-management')
    },
    { 
      title: 'Public Alerts', 
      icon: AlertTriangle, 
      color: 'text-warning',
      action: () => navigate('/public-alerts')
    }
  ];


  const recentVisits = [
    {
      doctor: 'Dr. Priya Sharma',
      specialty: 'General Medicine',
      date: '2 days ago',
      status: 'Follow-up required'
    },
    {
      doctor: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      date: '1 week ago',
      status: 'Completed'
    }
  ];

  const handleQRShow = () => {
    setShowQR(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Wave */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-white h-64 p-6 z-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hello, {user?.name.split(' ')[0]} 👋</h1>
            <p className="opacity-90">Welcome back to your health dashboard</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="hsl(var(--background))" fillOpacity="1" d="M1440,80 C1000,300 440,300 0,280 L0,320 L1440,320 Z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10 -mt-32 px-4 pb-24">
        <div className="mx-auto">
          {/* Profile Card Section */}
          <section className="mb-8">
            <Card className="card-soft p-4 flex items-center space-x-6">
              <Avatar className="h-20 w-20 border-4 border-white/50 shadow-lg">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div>
                  <p className="text-sm text-muted-foreground">Aadhaar ID</p>
                  <p className="font-mono font-semibold">{user?.aadhaarId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ABHA ID</p>
                  <p className="font-mono font-semibold">{user?.abhaId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-mono font-semibold">{user?.contact}</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Quick Actions Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <QrCode className="mr-2 text-primary" size={24} />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card
                    key={index}
                    className="health-record-card cursor-pointer hover:scale-105 transition-transform"
                    onClick={action.action}
                  >
                    <div className="flex flex-col items-center text-center p-4">
                      <IconComponent className={`${action.color} mb-3`} size={32} />
                      <h3 className="font-medium text-sm">{action.title}</h3>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Health Records Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-primary" size={24} />
              Your Health Records
            </h2>
            <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {Array.from({ length: Math.ceil(healthRecords.length / 2) }).map((_, index) => (
                  <CarouselItem key={index} className="basis-full flex gap-4">
                    {healthRecords.slice(index * 2, index * 2 + 2).map((record) => {
                      const IconComponent = record.icon;
                      return (
                        <div className="w-1/2" key={record.type}>
                          <Card
                            className="health-record-card h-full cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => navigate(record.path)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <IconComponent className={record.color} size={20} />
                              <Badge variant="secondary">{record.count}</Badge>
                            </div>
                            <h3 className="font-medium text-sm">{record.type}</h3>
                          </Card>
                        </div>
                      );
                    })}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: count }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${current === index + 1 ? 'w-4 bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </section>

          {/* Recent Visits Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CalendarDays className="mr-2 text-secondary" size={24} />
              Recent Visits
            </h2>
            <div className="space-y-3">
              {recentVisits.map((visit, index) => (
                <Card key={index} className="card-soft p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <Stethoscope className="text-white" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium">{visit.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{visit.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{visit.date}</div>
                      <Badge
                        variant={visit.status === 'Completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {visit.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating QR Button */}
      <Button
        onClick={handleQRShow}
        className="floating-qr"
      >
        <QrCode className="mr-3" size={24} />
        Scan Me
      </Button>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />

      {/* QR Modal */}
      <QRModal 
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        abhaId={user?.abhaId || ''}
        patientName={user?.name || ''}
      />

      {/* QR Scanner */}
      {showQRScanner && (
        <div className="fixed inset-0 z-50 bg-background">
          <QRScanner onClose={() => setShowQRScanner(false)} />
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;