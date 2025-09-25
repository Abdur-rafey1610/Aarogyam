import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const Schemes = () => {
  const navigate = useNavigate();

  const schemes = [
    {
      title: 'Ayushman Bharat',
      description: 'Free healthcare coverage up to ₹5 lakh per family per year for secondary and tertiary care',
      status: 'Active',
      logo: '🏥',
      benefits: ['Free treatment up to ₹5 lakh', 'Cashless facility', '1,393 procedures covered'],
      eligibility: 'Rural and urban poor families',
      documents: ['Ration Card', 'ABHA ID', 'Income Certificate']
    },
    {
      title: 'Pradhan Mantri Jan Arogya Yojana',
      description: 'Comprehensive healthcare scheme providing cashless treatment',
      status: 'Eligible',
      logo: '💊',
      benefits: ['Pre and post-hospitalization care', 'Day care procedures', 'Emergency services'],
      eligibility: 'Socio-economic caste census beneficiaries',
      documents: ['Eligibility Letter', 'ABHA ID', 'Identity Proof']
    },
    {
      title: 'TB Mukt Bharat',
      description: 'National program for TB elimination with free diagnosis and treatment',
      status: 'Available',
      logo: '🔬',
      benefits: ['Free TB testing', 'Complete treatment support', 'Nutritional support'],
      eligibility: 'All TB patients and suspects',
      documents: ['Medical records', 'ABHA ID', 'Address proof']
    },
    {
      title: 'Janani Suraksha Yojana',
      description: 'Safe motherhood intervention promoting institutional delivery',
      status: 'Eligible',
      logo: '👶',
      benefits: ['Cash assistance for delivery', 'Free delivery care', 'Post-natal support'],
      eligibility: 'Pregnant women from BPL families',
      documents: ['Pregnancy card', 'BPL certificate', 'ABHA ID']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success text-success-foreground';
      case 'Eligible':
        return 'bg-warning text-warning-foreground';
      case 'Available':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return CheckCircle;
      case 'Eligible':
        return Clock;
      case 'Available':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white p-2 hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Healthcare Schemes</h1>
        </div>
        <p className="opacity-90">Discover government healthcare programs available to you</p>
      </div>

      <div className="p-6">
        {/* Schemes List */}
        <div className="space-y-4">
          {schemes.map((scheme, index) => {
            const StatusIcon = getStatusIcon(scheme.status);
            return (
              <Card key={index} className="scheme-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{scheme.logo}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{scheme.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{scheme.description}</p>
                      
                      <Badge className={`${getStatusColor(scheme.status)} mb-4`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {scheme.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-success" />
                    Key Benefits
                  </h4>
                  <ul className="space-y-1">
                    {scheme.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility & Documents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-xs text-muted-foreground mb-1">ELIGIBILITY</h4>
                    <p className="text-sm">{scheme.eligibility}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-muted-foreground mb-1">REQUIRED DOCUMENTS</h4>
                    <p className="text-sm">{scheme.documents.join(', ')}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="btn-capsule flex-1">
                    Apply Now
                  </Button>
                  <Button variant="outline" size="sm" className="btn-capsule">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNavigation activeTab="schemes" />
    </div>
  );
};

export default Schemes;