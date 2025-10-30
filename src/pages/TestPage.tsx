import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-2 mr-4"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold">Test Page</h1>
      </div>

      <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">NFC Scan Successful!</h2>
        <p className="mb-4">
          You have been redirected to this test page after a successful NFC scan.
        </p>
        <p className="mb-6">
          This page can be customized to display information or perform actions based on the NFC scan.
        </p>
        
        <div className="bg-secondary/20 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2">Next Steps:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Display scanned NFC data</li>
            <li>Fetch additional information based on the scan</li>
            <li>Provide actions or navigation options</li>
          </ul>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mr-2"
          >
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/scan')}
          >
            Scan Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
