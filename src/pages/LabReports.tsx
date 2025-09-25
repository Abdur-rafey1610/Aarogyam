import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Download, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";

const LabReports = () => {
  const reports = [
    {
      id: 1,
      testName: 'Complete Blood Count (CBC)',
      date: '2024-09-15',
      lab: 'Path Labs',
      status: 'Normal',
      parameters: [
        { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '12-16', status: 'normal' },
        { name: 'WBC Count', value: '7,200', unit: '/μL', range: '4,000-11,000', status: 'normal' },
        { name: 'Platelet Count', value: '350,000', unit: '/μL', range: '150,000-450,000', status: 'normal' }
      ]
    },
    {
      id: 2,
      testName: 'Lipid Profile',
      date: '2024-09-10',
      lab: 'SRL Diagnostics',
      status: 'Attention Required',
      parameters: [
        { name: 'Total Cholesterol', value: '220', unit: 'mg/dL', range: '<200', status: 'high' },
        { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', range: '>40', status: 'normal' },
        { name: 'LDL Cholesterol', value: '140', unit: 'mg/dL', range: '<100', status: 'high' }
      ]
    },
    {
      id: 3,
      testName: 'Blood Sugar (Fasting)',
      date: '2024-09-05',
      lab: 'Metropolis Healthcare',
      status: 'Normal',
      parameters: [
        { name: 'Glucose (Fasting)', value: '95', unit: 'mg/dL', range: '70-100', status: 'normal' }
      ]
    },
    {
      id: 4,
      testName: 'Thyroid Function Test',
      date: '2024-08-28',
      lab: 'Dr. Lal PathLabs',
      status: 'Normal',
      parameters: [
        { name: 'TSH', value: '2.5', unit: 'mIU/L', range: '0.4-4.0', status: 'normal' },
        { name: 'T3', value: '1.2', unit: 'ng/mL', range: '0.8-2.0', status: 'normal' },
        { name: 'T4', value: '8.5', unit: 'μg/dL', range: '5.0-12.0', status: 'normal' }
      ]
    },
    {
      id: 5,
      testName: 'Liver Function Test',
      date: '2024-08-20',
      lab: 'Quest Diagnostics',
      status: 'Normal',
      parameters: [
        { name: 'ALT', value: '25', unit: 'U/L', range: '7-56', status: 'normal' },
        { name: 'AST', value: '30', unit: 'U/L', range: '10-40', status: 'normal' },
        { name: 'Bilirubin', value: '0.8', unit: 'mg/dL', range: '0.3-1.2', status: 'normal' }
      ]
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Normal':
        return { variant: 'default' as const, color: 'text-success' };
      case 'Attention Required':
        return { variant: 'destructive' as const, color: 'text-destructive' };
      default:
        return { variant: 'secondary' as const, color: 'text-muted-foreground' };
    }
  };

  const getParameterTrend = (status: string) => {
    switch (status) {
      case 'high':
        return { icon: TrendingUp, color: 'text-destructive' };
      case 'low':
        return { icon: TrendingDown, color: 'text-warning' };
      default:
        return { icon: Minus, color: 'text-success' };
    }
  };

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="card-soft text-center p-4">
          <Activity className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">{reports.length}</div>
          <div className="text-sm text-muted-foreground">Total Tests</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-success">{reports.filter(r => r.status === 'Normal').length}</div>
          <div className="text-sm text-muted-foreground">Normal</div>
        </Card>
        <Card className="card-soft text-center p-4">
          <div className="text-2xl font-bold text-destructive">{reports.filter(r => r.status === 'Attention Required').length}</div>
          <div className="text-sm text-muted-foreground">Need Attention</div>
        </Card>
      </div>

      {/* Reports List */}
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
        {reports.map((report) => {
          const statusConfig = getStatusConfig(report.status);

          return (
            <AccordionItem key={report.id} value={`item-${report.id}`} className="card-soft px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <h3 className="font-semibold text-md">{report.testName}</h3>
                    <p className="text-sm text-muted-foreground">{report.lab} • {report.date}</p>
                  </div>
                  <Badge variant={statusConfig.variant} className="ml-4">{report.status}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {/* Parameters */}
                <div className="space-y-3 mb-4 border-t pt-4">
                  <h4 className="font-medium text-sm">Test Parameters:</h4>
                  {report.parameters.map((param, idx) => {
                    const trend = getParameterTrend(param.status);
                    const TrendIcon = trend.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                        <div>
                          <div className="font-medium text-sm">{param.name}</div>
                          <div className="text-xs text-muted-foreground">Range: {param.range}</div>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <div className="font-semibold">{param.value} <span className="text-xs text-muted-foreground">{param.unit}</span></div>
                          </div>
                          <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="btn-capsule"><Eye className="w-4 h-4 mr-2" />View Report</Button>
                  <Button size="sm" variant="outline" className="btn-capsule"><Download className="w-4 h-4 mr-2" />Download</Button>
                  <Button size="sm" className="btn-capsule btn-primary">Share with Doctor</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default LabReports;