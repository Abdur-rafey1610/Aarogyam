import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboard from "./components/PatientDashboard";
import DoctorInterface from "./components/DoctorInterface";
import NotFound from "./pages/NotFound";
import Schemes from "./pages/Schemes";
import PublicAlerts from "./pages/PublicAlerts";
import RecentVisits from "./pages/RecentVisits";
import LabReports from "./pages/LabReports";
import Prescriptions from "./pages/Prescriptions";
import Immunization from "./pages/Immunization";
import Allergies from "./pages/Allergies";
import FamilyManagement from "./pages/FamilyManagement";
import ViewRecord from "./pages/ViewRecord";
import Records from "./pages/Records";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/doctor-interface" element={<DoctorInterface />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/public-alerts" element={<PublicAlerts />} />
              <Route path="/recent-visits" element={<RecentVisits />} />
              <Route path="/records" element={<Records />}>
                <Route index element={<Prescriptions />} />
                <Route path="prescriptions" element={<Prescriptions />} />
                <Route path="lab-reports" element={<LabReports />} />
                <Route path="immunization" element={<Immunization />} />
                <Route path="allergies" element={<Allergies />} />
              </Route>
              <Route path="/family-management" element={<FamilyManagement />} />
              <Route path="/view-record/:userType/:abhaId" element={<ViewRecord />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
