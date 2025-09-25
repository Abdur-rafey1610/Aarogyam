import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, NfcIcon, ArrowLeft, Loader2, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Lazy load the QrReader component to avoid SSR issues
const QrReader = lazy(() => import('react-qr-reader').then(module => ({
  default: (props: any) => {
    const QrReaderComponent = module.default || module.QrReader;
    return <QrReaderComponent {...props} />;
  }
})));

interface QRScannerProps {
  onClose: () => void;
  showNfcButton?: boolean;
  onScanComplete?: (data: string) => void;
}

const QRScanner = ({ onClose, showNfcButton = true, onScanComplete }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const qrRef = useRef<any>(null);
  const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes

  // Check camera permissions
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setHasPermission(true);
        } else {
          setHasPermission(false);
          toast({
            title: "Camera Access Unavailable",
            description: "Your device doesn't support camera access or permission was denied.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Camera permission error:", err);
        setHasPermission(false);
        toast({
          title: "Camera Access Denied",
          description: "Please enable camera access to scan QR codes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkCameraPermission();
  }, [toast]);

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleScan = (data: string | null) => {
    if (data) {
      console.log("Scanned data:", data);
      // If onScanComplete prop is provided, call it with the scanned data
      if (onScanComplete) {
        onScanComplete(data);
      } else {
        // Default behavior: navigate to view-record with the scanned data
        toast({
          title: "QR Code Scanned",
          description: "Processing patient information...",
        });
        
        // In a real app, you would process the data and navigate accordingly
        const sessionEnd = Date.now() + SESSION_DURATION;
        localStorage.setItem('viewRecordSessionEnd', sessionEnd.toString());
        
        // Assume data is a patient ID or similar identifier
        navigate(`/view-record/patient/${encodeURIComponent(data)}`);
      }
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
    toast({
      title: "Scan Error",
      description: "Failed to scan QR code. Please try again.",
      variant: "destructive",
    });
  };

  const toggleCamera = () => {
    setCameraFacingMode(prev => 
      prev === 'environment' ? 'user' : 'environment'
    );
  };

  const handleNFCTap = async () => {
    if ('NDEFReader' in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        toast({
          title: "NFC Ready",
          description: "Tap ABHA card to view health record.",
        });

        ndef.onreading = (event: any) => {
          console.log("NFC message read.", event);
          toast({
            title: "NFC Card Scanned",
            description: `Patient ID scanned successfully.`,
          });
        };
      } catch (error) {
        console.error("NFC Error:", error);
        toast({
          title: "NFC Error",
          description: "Could not start NFC scanning. Please ensure NFC is enabled in your device settings and you've granted permission.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "NFC Not Supported",
        description: "Your browser or device does not support Web NFC. Please use a compatible browser like Chrome on Android.",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const qrRef = useRef<any>(null);
  const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes

  // Check camera permissions
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setHasPermission(true);
        } else {
          setHasPermission(false);
          toast({
            title: "Camera Access Unavailable",
            description: "Your device doesn't support camera access or permission was denied.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Camera permission error:", err);
        setHasPermission(false);
        toast({
          title: "Camera Access Denied",
          description: "Please enable camera access to scan QR codes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkCameraPermission();
  }, []);

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleScan = (data: string | null) => {
    if (data) {
      console.log("Scanned data:", data);
      // If onScanComplete prop is provided, call it with the scanned data
      if (onScanComplete) {
        onScanComplete(data);
      } else {
        // Default behavior: navigate to view-record with the scanned data
        toast({
          title: "QR Code Scanned",
          description: "Processing patient information...",
        });
        
        // In a real app, you would process the data and navigate accordingly
        const sessionEnd = Date.now() + SESSION_DURATION;
        localStorage.setItem('viewRecordSessionEnd', sessionEnd.toString());
        
        // Assume data is a patient ID or similar identifier
        // You may need to parse the data if it's a JSON string or URL
        navigate(`/view-record/patient/${encodeURIComponent(data)}`);
      }
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
    toast({
      title: "Scan Error",
      description: "Failed to scan QR code. Please try again.",
      variant: "destructive",
    });
  };

  const toggleCamera = () => {
    setCameraFacingMode(prev => 
      prev === 'environment' ? 'user' : 'environment'
    );
  };

  const handleNFCTap = async () => {
    if ('NDEFReader' in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        toast({
          title: "NFC Ready",
          description: "Tap ABHA card to view health record.",
        });

        ndef.onreading = event => {
          console.log("NFC message read.", event);
          // TODO: Process the NFC message
          toast({
            title: "NFC Card Scanned",
            description: `Patient ID scanned successfully.`,
          });
        };

      } catch (error) {
        console.error("NFC Error:", error);
        toast({
          title: "NFC Error",
          description: "Could not start NFC scanning. Please ensure NFC is enabled in your device settings and you've granted permission.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "NFC Not Supported",
        description: "Your browser or device does not support Web NFC. Please use a compatible browser like Chrome on Android.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Checking camera permissions...</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold ml-4">QR Code Scanner</h1>
        </div>
        <Card className="p-6 text-center">
          <div className="text-destructive mb-4">
            <Camera className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Camera Access Required</h3>
            <p className="text-muted-foreground mt-2">
              Please enable camera permissions in your browser settings to use the QR scanner.
            </p>
          </div>
          <Button onClick={onClose} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" onClick={onClose} className="p-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">Scan Patient QR Code</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        {/* Suspense boundary for lazy loading */}
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
};
          {!isScanning ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center mb-8">
            <div className="w-64 h-64 mx-auto border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center bg-background/10 mb-6">
              <div className="text-center p-4">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                <p className="text-sm text-muted-foreground">Ready to scan patient QR code</p>
              </div>
            </div>
            
            <Button 
              onClick={handleStartScan} 
              className="btn-capsule w-full max-w-xs mb-6 flex items-center justify-center gap-2"
              size="lg"
            >
              <Camera className="w-5 h-5" />
              Start Scanning
            </Button>
            
            {showNfcButton && (
              <div className="mt-8">
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">OR</span>
                  </div>
                </div>
                
                <Card className="p-6 bg-background border-dashed border-2 border-primary/20">
                  <div className="text-center">
                    <NfcIcon className="w-10 h-10 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold text-lg mb-2">Tap ABHA Card</h3>
                    <p className="text-muted-foreground mb-4">
                      Place your ABHA card near your device to view health record
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleNFCTap} 
                      className="btn-capsule w-full max-w-xs"
                    >
                      Enable NFC
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
            <p className="font-medium mb-2">How to scan:</p>
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Position the QR code within the frame</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Ensure good lighting and avoid glare</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Hold steady until the code is recognized</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          <div className="w-full h-full">
            <QrReader
              ref={qrRef}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%', height: '100%' }}
              facingMode={cameraFacingMode}
              showViewFinder={false}
              constraints={{
                facingMode: cameraFacingMode,
                aspectRatio: 1
              }}
            />
            
            {/* Scanner frame overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64 border-4 border-primary rounded-lg">
                {/* Corner indicators */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Camera toggle button */}
            <Button 
              onClick={toggleCamera}
              variant="outline" 
              size="icon"
              className="absolute bottom-6 right-6 rounded-full w-12 h-12 bg-background/50 backdrop-blur-sm"
            >
              <Camera className="w-6 h-6" />
            </Button>
            
            {/* Back button */}
            <Button 
              onClick={() => setIsScanning(false)}
              variant="outline" 
              size="icon"
              className="absolute top-6 left-6 rounded-full w-12 h-12 bg-background/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )
    }
    
    return (
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <div className="w-full h-full">
          <QrReader
            ref={qrRef}
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', height: '100%' }}
            facingMode={cameraFacingMode}
            showViewFinder={false}
            constraints={{
              facingMode: cameraFacingMode,
              aspectRatio: 1
            }}
          />
          
          {/* Scanner frame overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64 border-4 border-primary rounded-lg">
              {/* Corner indicators */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Camera toggle button */}
          <Button 
            onClick={toggleCamera}
            variant="outline" 
            size="icon"
            className="absolute bottom-6 right-6 rounded-full w-12 h-12 bg-background/50 backdrop-blur-sm"
          >
            <Camera className="w-6 h-6" />
          </Button>
          
          {/* Back button */}
          <Button 
            onClick={() => setIsScanning(false)}
            variant="outline" 
            size="icon"
            className="absolute top-6 left-6 rounded-full w-12 h-12 bg-background/50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" onClick={onClose} className="p-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">Scan Patient QR Code</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        {/* Suspense boundary for lazy loading */}
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
};

export default QRScanner;