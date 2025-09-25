import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  abhaId: string;
  patientName: string;
}

const QRModal = ({ isOpen, onClose, abhaId, patientName }: QRModalProps) => {
  // In a real app, this would generate an actual QR code with the ABHA data
  const qrData = `ABHA:${abhaId}:${patientName}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Your ABHA QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          {/* QR Code */}
          <div className="p-4 bg-white rounded-lg shadow-inner">
            <QRCodeSVG
              value={qrData}
              size={192}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>

          {/* Patient Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{patientName}</h3>
            <p className="text-sm text-muted-foreground">ABHA ID: {abhaId}</p>
          </div>

          {/* Instructions */}
          <div className="bg-accent/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Show this QR code to healthcare providers for instant access to your health profile and records.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button variant="outline" className="btn-capsule">
              <Download size={16} className="mr-2" />
              Save
            </Button>
            <Button variant="outline" className="btn-capsule">
              <Share size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModal;