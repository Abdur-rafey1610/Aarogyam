import { useState, useRef, useCallback, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, NfcIcon, ArrowLeft, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Import QR reader from react-qr-reader-es6
import QrReader from 'react-qr-reader-es6';

// Import the Web NFC type definitions
/// <reference path="../types/web-nfc.d.ts" />

// Add type definitions for the QR reader props
interface QrReaderProps {
  onScan: (data: string | null) => void;
  onError: (err: any) => void;
  onLoad?: () => void;
  delay?: number;
  facingMode?: 'user' | 'environment';
  style?: React.CSSProperties;
  showViewFinder?: boolean;
  constraints?: MediaTrackConstraints;
  resolution?: number;
  className?: string;
}

type QRScanResult = {
  abhaId: string;
  name: string;
  userType: 'patient' | 'provider';
  timestamp: number;
};

interface QRScannerProps {
  onClose: () => void;
  showNfcButton?: boolean;
  onScanSuccess?: (result: QRScanResult) => void;
}

const QRScanner = ({ onClose, showNfcButton = true, onScanSuccess }: QRScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const { toast } = useToast();
  const navigate = useNavigate();
  const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes

  // Check camera permissions
  const checkCameraPermissions = useCallback(async () => {
    try {
      // First check if we have permission to access the camera
      const permissionResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionResult.state === 'denied') {
        throw new Error('Camera access was denied. Please enable it in your browser settings.');
      }
      
      // Try to get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Get all video inputs to check available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('No camera found on this device.');
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      setIsScanning(true);
      
    } catch (err: any) {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      
      let errorMessage = "Failed to access the camera. ";
      
      if (err.name === 'NotAllowedError') {
        errorMessage += "Please check your browser permissions and allow camera access.";
      } else if (err.name === 'NotFoundError') {
        errorMessage += "No camera found on this device.";
      } else if (err.name === 'NotReadableError') {
        errorMessage += "Camera is already in use by another application.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Camera Access Required",
        description: errorMessage,
        variant: "destructive" as const,
      });
    }
  }, [cameraFacingMode, toast]);

  const handleStartScan = () => {
    if (!hasPermission) {
      checkCameraPermissions();
    } else {
      setIsScanning(true);
    }
    checkCameraPermissions();
  };

  const handleScanResult = (result: string | null) => {
    if (!result || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      let parsedResult: QRScanResult;
      
      // Try to parse the result as JSON first
      try {
        parsedResult = JSON.parse(result);
      } catch (e) {
        // If it's not JSON, treat it as a direct ABHA ID
        parsedResult = {
          abhaId: result,
          name: "Patient",
          userType: 'patient',
          timestamp: Date.now()
        };
      }
      
      // Validate the scanned data
      if (!parsedResult.abhaId) {
        throw new Error("Invalid QR code format: Missing ABHA ID");
      }
      
      // Call the success callback if provided
      if (onScanSuccess) {
        onScanSuccess(parsedResult);
      }
      
      // Set session
      const sessionEnd = Date.now() + SESSION_DURATION;
      localStorage.setItem('viewRecordSessionEnd', sessionEnd.toString());
      
      // Navigate based on user type
      if (parsedResult.userType === 'patient') {
        navigate(`/view-record/patient/${parsedResult.abhaId}`);
      } else {
        navigate(`/view-record/provider/${parsedResult.abhaId}`);
      }
      
      toast({
        title: "QR Code Scanned Successfully",
        description: `Accessing ${parsedResult.name || 'user'}'s record`,
      });
      
    } catch (error) {
      console.error("Error scanning QR code:", error);
      toast({
        title: "Invalid QR Code",
        description: "The scanned QR code is not valid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    console.error("QR Scanner error:", error);
    
    let errorMessage = "An unexpected error occurred while scanning.";
    
    if (error.name === 'NotAllowedError') {
      errorMessage = "Camera access was denied. Please check your browser permissions.";
    } else if (error.name === 'NotFoundError') {
      errorMessage = "No camera found on this device.";
    } else if (error.name === 'NotSupportedError') {
      errorMessage = "Camera access is not supported in this browser.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast({
      title: "Scanner Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    // Reset scanning state on error
    setIsScanning(false);
    setHasPermission(false);
  };

  const handleNFCTap = async () => {
    if (!('NDEFReader' in window)) {
      toast({
        title: "NFC Not Supported",
        description: "Your browser or device does not support Web NFC. Please use Chrome on Android to use this feature.",
        variant: "destructive" as const,
      });
      return;
    }

    // Check if NFC is available
    if (!navigator.permissions) {
      toast({
        title: "Permissions API Not Supported",
        description: "Your browser doesn't support the Permissions API which is required for NFC scanning.",
        variant: "destructive" as const,
      });
      return;
    }

    try {
      // Check NFC permission
      const nfcPermission = await navigator.permissions.query({ name: 'nfc' as PermissionName });
      
      if (nfcPermission.state === 'denied') {
        throw new Error('NFC permission was denied. Please enable it in your browser settings.');
      }

      const ndef = new window.NDEFReader();
      
      // Show scanning message
      toast({
        title: "Ready to Scan",
        description: "Hold your ABHA card near the back of your device to scan.",
        variant: "default" as const,
      });

      // Create an AbortController for the NFC scan
      const abortController = new AbortController();
      
      // Set a timeout for the NFC scan
      const scanTimeout = setTimeout(() => {
        abortController.abort();
        toast({
          title: "Scan Timeout",
          description: "NFC scan timed out. Please try again.",
          variant: "destructive" as const
        });
      }, 30000); // 30 second timeout

      // Start the NFC scan with the abort signal
      await ndef.scan({
        signal: abortController.signal
      });

      ndef.onreading = (event) => {
        clearTimeout(scanTimeout); // Clear the timeout on successful read
        
        try {
          console.log("NFC message read:", event);
          
          // Process the NFC message
          const decoder = new TextDecoder();
          let abhaId: string | null = null;
          let patientName: string | null = null;
          
          // Look for text records
          for (const record of event.message.records) {
            if (record.recordType === 'text') {
              const text = decoder.decode(record.data);
              // Try to parse as JSON first
              try {
                const data = JSON.parse(text);
                if (data.abhaId) {
                  abhaId = data.abhaId;
                  patientName = data.name || null;
                  break;
                }
              } catch (e) {
                // If not JSON, use as direct ID
                abhaId = text;
              }
            }
          }
          
          if (abhaId) {
            handleScanResult(JSON.stringify({
              abhaId,
              name: patientName || "Patient",
              userType: 'patient',
              timestamp: Date.now()
            }));
          } else {
            throw new Error("No valid ABHA ID found in the NFC tag.");
          }
        } catch (error: any) {
          console.error("Error processing NFC tag:", error);
          toast({
            title: "NFC Read Error",
            description: error.message || "Failed to read the NFC tag. Please try again.",
            variant: "destructive",
          });
        }
      };

      ndef.onreadingerror = (event) => {
        console.error("NFC read error:", event);
        clearTimeout(scanTimeout);
        toast({
          title: "NFC Read Error",
          description: "An error occurred while reading the NFC tag. Please try again.",
          variant: "destructive",
        });
      };

    } catch (error: any) {
      console.error("NFC Error:", error);
      
      let errorMessage = "Failed to start NFC scanning. ";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "NFC permission was denied. Please enable it in your browser settings.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "NFC is not supported on this device or is disabled.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "NFC Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const toggleCamera = () => {
    setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isScanning) {
      checkCameraPermissions();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="p-2"
          disabled={isProcessing}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold">Scan QR Code</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Camera View */}
      <Card className="card-soft mb-6 p-4 md:p-8 text-center bg-gradient-to-b from-primary/5 to-secondary/5">
        <div className="mb-6">
          <div className="w-full max-w-md mx-auto aspect-square border-2 border-dashed border-primary/30 rounded-lg overflow-hidden bg-background/50 flex items-center justify-center">
            {isScanning ? (
              hasPermission === false ? (
                <div className="text-center p-4">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                  <h3 className="font-semibold mb-2">Camera Access Denied</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please allow camera access in your browser settings to scan QR codes.
                  </p>
                  <Button 
                    onClick={checkCameraPermissions}
                    variant="outline"
                    className="mt-2"
                  >
                    Retry Camera Access
                  </Button>
                </div>
              ) : (
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                }>
                  <div className="w-full h-full relative">
                    <div className="relative w-full h-full">
                      <QrReader
                        onScan={handleScanResult}
                        onError={handleError}
                        delay={300}
                        facingMode={cameraFacingMode}
                        style={{ width: '100%', height: '100%' }}
                        showViewFinder={false}
                        resolution={800}
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('QR Reader loaded')}
                      />
                      <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none" />
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm z-10"
                        onClick={toggleCamera}
                        disabled={isProcessing}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    </div>
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center p-4 bg-background rounded-lg">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p className="text-sm">Processing QR code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Suspense>
              )
            ) : (
              <div className="text-center p-4">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Scan QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Position a QR code within the frame to scan
                </p>
                <Button 
                  onClick={handleStartScan} 
                  className="btn-capsule"
                  disabled={hasPermission === false}
                >
                  <Camera className="mr-2" size={20} />
                  Start Scanning
                </Button>
              </div>
            )}
          </div>
        </div>

        {showNfcButton && (
          <>
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
                <NfcIcon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Tap ABHA Card</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Place your ABHA card near your device to view health record
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleNFCTap} 
                  className="btn-capsule"
                  disabled={isProcessing}
                >
                  Enable NFC
                </Button>
              </div>
            </Card>
          </>
        )}
      </Card>

      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Ensure proper lighting for QR scanning</p>
        <p>Position the QR code within the frame</p>
        {showNfcButton && <p>NFC requires enabled device settings</p>}
      </div>
    </div>
  );
};

export default QRScanner;
