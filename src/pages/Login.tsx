import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@/assets/aarogyam-hero.jpg';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleCitizenLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add logic to send OTP
    setShowOtpInput(true);
  };

  const handleOtpSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add OTP verification logic
    login('citizen');
    navigate('/patient-dashboard');
  };

  const handleProviderLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add actual authentication logic here
    login('provider');
    navigate('/doctor-interface');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div 
          className="relative overflow-hidden rounded-t-lg h-48 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 text-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/60" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              आरोग्यम् Aarogyam
            </h1>
            <p className="text-xl text-white/90">
              Unified Healthcare for All
            </p>
          </div>
        </div>

        <Tabs defaultValue="citizen" className="w-full bg-card rounded-b-lg">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="citizen">
              <User className="mr-2 h-4 w-4" /> Citizen
            </TabsTrigger>
            <TabsTrigger value="healthcare_provider">
              <Building className="mr-2 h-4 w-4" /> Healthcare Provider
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citizen">
            <Card>
              <CardHeader>
                <CardTitle>Citizen Login</CardTitle>
                <CardDescription>Enter your ABHA ID and linked phone number to continue.</CardDescription>
              </CardHeader>
              <CardContent>
                {!showOtpInput ? (
                  <form onSubmit={handleCitizenLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="abhaId">ABHA ID</Label>
                      <Input id="abhaId" type="text" placeholder="e.g., 12-3456-7890-1234" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="e.g., 9876543210" required />
                    </div>
                    <Button type="submit" className="w-full btn-primary btn-capsule mt-4">Send OTP</Button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-6 flex flex-col items-center">
                    <div className="space-y-2 text-center">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <p className="text-sm text-muted-foreground">An OTP has been sent to your registered number.</p>
                    </div>
                    <InputOTP maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <Button type="submit" className="w-full btn-primary btn-capsule mt-4">Verify OTP</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="healthcare_provider">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Provider Login</CardTitle>
                <CardDescription>Enter your organization and personnel IDs to proceed.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProviderLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgId">Organization ID</Label>
                    <Input id="orgId" type="text" placeholder="e.g., HOS-12345" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personnelId">Healthcare Personnel ID</Label>
                    <Input id="personnelId" type="text" placeholder="e.g., DOC-67890" required />
                  </div>
                  <Button type="submit" className="w-full btn-secondary btn-capsule mt-4">Login as Provider</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by Digital India Healthcare Initiative</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
