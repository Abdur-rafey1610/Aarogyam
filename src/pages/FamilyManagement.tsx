import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';
import { ArrowLeft, UserPlus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddFamilyMemberModal, { FamilyMemberFormData } from '@/components/AddFamilyMemberModal';


type FamilyMember = {
  name: string;
  relation: string;
  abhaId: string;
  avatar: string;
};

const FamilyManagement = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      name: 'Meena Patel',
      relation: 'Spouse',
      abhaId: '14-2345-6789-0123',
      avatar: '/avatars/01.png',
    },
    {
      name: 'Rohan Patel',
      relation: 'Son',
      abhaId: '14-3456-7890-1234',
      avatar: '/avatars/02.png',
    },
    {
      name: 'Sunita Patel',
      relation: 'Mother',
      abhaId: '14-4567-8901-2345',
      avatar: '/avatars/03.png',
    },
  ]);

  const handleAddMember = (data: FamilyMemberFormData) => {
    const newMember: FamilyMember = {
      name: data.name,
      relation: data.relation,
      abhaId: data.abhaId,
      avatar: `/avatars/0${(familyMembers.length % 5) + 1}.png`
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 sticky top-0 z-10 shadow-md">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Family Management</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Add Member Button */}
        <div className="mb-8">
          <Button onClick={() => setIsModalOpen(true)} className="w-full btn-success btn-capsule py-6 text-lg">
            <UserPlus className="mr-3" size={24} />
            Add New Family Member
          </Button>
        </div>

        {/* Family Member List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Family Members</h2>
          <div className="space-y-4">
            {familyMembers.map((member, index) => (
              <Card key={index} className="card-soft p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.relation}</p>
                    <p className="text-xs text-muted-foreground font-mono">ABHA: {member.abhaId}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <AddFamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default FamilyManagement;
