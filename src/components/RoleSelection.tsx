import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, Shield } from "lucide-react";
import heroImage from "@/assets/aarogyam-hero.jpg";

interface RoleSelectionProps {
  onRoleSelect: (role: 'patient' | 'doctor' | 'admin') => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roles = [
    {
      id: 'patient',
      title: 'Patient / Migrant',
      description: 'Access your health records, government schemes, and medical history',
      icon: User,
      gradient: 'from-primary to-primary-light',
      features: ['Health Records', 'Schemes Access', 'QR Code Profile', 'Visit History']
    },
    {
      id: 'doctor',
      title: 'Healthcare Provider',
      description: 'Manage patients, access medical records, and update health data',
      icon: Stethoscope,
      gradient: 'from-secondary to-secondary-light',
      features: ['Patient Search', 'Medical Records', 'Prescriptions', 'QR Scanner']
    },
    {
      id: 'admin',
      title: 'Government Admin',
      description: 'Manage healthcare schemes, monitor systems, and generate reports',
      icon: Shield,
      gradient: 'from-success to-success-light',
      features: ['Scheme Management', 'Analytics', 'User Management', 'Reports']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/40" />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 -mt-32 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-4">
              आरोग्यम् Aarogyam
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Unified Healthcare for All
            </p>
            <p className="text-sm text-muted-foreground">
              Choose your role to access personalized healthcare services
            </p>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id}
                className={`
                  card-gradient p-6 cursor-pointer transition-all duration-300 hover:scale-105
                  ${selectedRole === role.id ? 'ring-2 ring-primary scale-105' : ''}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="text-center mb-6">
                  <div className={`
                    w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.gradient} 
                    flex items-center justify-center text-white shadow-lg
                  `}>
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {role.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={() => selectedRole && onRoleSelect(selectedRole as any)}
            disabled={!selectedRole}
            className="btn-capsule btn-primary px-8 py-4 text-lg font-medium disabled:opacity-50"
          >
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : 'User'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by Digital India Healthcare Initiative</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;