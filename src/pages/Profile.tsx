import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, ChevronRight, Bell, Shield, Palette, LogOut, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white p-2 hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold ml-4">My Profile</h1>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6 -mt-16">
        <Card className="p-6 flex flex-col items-center text-center card-soft">
          <Avatar className="w-24 h-24 mb-4 border-4 border-primary/50 ring-4 ring-primary/20">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">ABHA ID: {user.abhaId}</p>
        </Card>
      </div>

      {/* Personal Details */}
      <div className="px-6">
        <Card className="p-4 card-soft">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Personal Details</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Contact</span>
              <span>{user.contact}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span>{user.email}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date of Birth</span>
              <span>{user.dob}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Family Members */}
      <div className="px-6 mt-6">
        <h3 className="font-semibold mb-4">Family Members</h3>
        <div className="space-y-2">
          {user.familyMembers.map((member, index) => (
            <Card key={index} className="p-4 card-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-4">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.relation} • ABHA ID: {member.abhaId}</p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 mt-6">
        <h3 className="font-semibold mb-4">Settings</h3>
        <Card className="p-2 card-soft">
          <div className="space-y-1">
            <SettingsItem icon={User} label="Account Settings" />
            <Separator />
            <SettingsItem icon={Bell} label="Notifications" />
            <Separator />
            <SettingsItem icon={Shield} label="Security" />
            <Separator />
            <SettingsItem icon={Palette} label="Theme" />
          </div>
        </Card>
      </div>

      {/* Logout */}
      <div className="px-6 mt-6">
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

const SettingsItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
    <div className="flex items-center">
      <Icon className="w-5 h-5 mr-4 text-primary" />
      <span className="font-medium">{label}</span>
    </div>
    <ChevronRight className="text-muted-foreground" />
  </div>
);

export default Profile;
