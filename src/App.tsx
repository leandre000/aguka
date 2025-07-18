
import React, { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Recruitment from "./pages/Recruitment";
import Payroll from "./pages/Payroll";
// import Performance from "./pages/Performance";
import EmployeePortal from "./pages/EmployeePortal";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminPortal from "./pages/portals/AdminPortal";
import ManagerPortal from "./pages/portals/ManagerPortal";
import RecruiterPortal from "./pages/portals/RecruiterPortal";
import TrainerPortal from "./pages/portals/TrainerPortal";
import AuditorPortal from "./pages/portals/AuditorPortal";
import UserManagement from "./pages/portals/admin/UserManagement";
import SystemSettings from "./pages/portals/admin/SystemSettings";
import Security from "./pages/portals/admin/Security";
import Analytics from "./pages/portals/admin/Analytics";
import AuditLogs from "./pages/portals/admin/AuditLogs";
import Backup from "./pages/portals/admin/Backup";
import SurveyResults from "./pages/portals/admin/SurveyResults";
import TeamMembers from "./pages/portals/manager/TeamMembers";
import Attendance from "./pages/portals/manager/Attendance";
import TimeOff from "./pages/portals/manager/TimeOff";
import Performance from "./pages/portals/manager/Performance";
import Approvals from "./pages/portals/manager/Approvals";
import Goals from "./pages/portals/manager/Goals";
import ManagerReports from "./pages/portals/manager/Reports";
import NotFound from "./pages/NotFound";
import EmployeeProfile from "./pages/portals/employee/Profile";
import Payslips from "./pages/portals/employee/Payslips";
import LeaveRequests from "./pages/portals/employee/LeaveRequests";
import ExpenseClaims from "./pages/portals/employee/ExpenseClaims";
import Training from "./pages/portals/employee/Training";
import Announcements from "./pages/portals/employee/Announcements";
import WellbeingSurvey from "./pages/portals/employee/WellbeingSurvey";
import HRFaq from "./pages/portals/employee/HRFaq";
import AIAssistant from "./pages/portals/employee/AIAssistant";
import JobPostings from "./pages/portals/recruiter/JobPostings";
import CandidateScreening from "./pages/portals/recruiter/CandidateScreening";
import InterviewScheduling from "./pages/portals/recruiter/InterviewScheduling";
import OfferManagement from "./pages/portals/recruiter/OfferManagement";
import CourseCreation from "./pages/portals/trainer/CourseCreation";
import TrainingSessions from "./pages/portals/trainer/TrainingSessions";
import EmployeeProgress from "./pages/portals/trainer/EmployeeProgress";
import ComplianceReports from "./pages/portals/auditor/ComplianceReports";
import RiskAssessment from "./pages/portals/auditor/RiskAssessment";
import InternalAudits from "./pages/portals/auditor/InternalAudits";
import Messages from "./pages/Messages";
import SuccessionPlanning from "./pages/SuccessionPlanning";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AITools from "./pages/AITools";

// --- PrivateRoute ---
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* Protected routes */}
                <Route element={<PrivateRoute />}> {/* All routes below require auth */}
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/recruitment" element={<Recruitment />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/ai-tools" element={<AITools />} />
                  {/* Portal pages */}
                  <Route path="/admin-portal" element={<AdminPortal />} />
                  <Route path="/manager-portal" element={<ManagerPortal />} />
                  <Route path="/employee-portal" element={<EmployeePortal />} />
                  <Route path="/recruiter-portal" element={<RecruiterPortal />} />
                  <Route path="/trainer-portal" element={<TrainerPortal />} />
                  <Route path="/auditor-portal" element={<AuditorPortal />} />
                  {/* Admin Portal Routes */}
                  <Route path="/admin-portal/users" element={<UserManagement />} />
                  <Route path="/admin-portal/settings" element={<SystemSettings />} />
                  <Route path="/admin-portal/security" element={<Security />} />
                  <Route path="/admin-portal/analytics" element={<Analytics />} />
                  <Route path="/admin-portal/audit-logs" element={<AuditLogs />} />
                  <Route path="/admin-portal/backup" element={<Backup />} />
                  <Route path="/admin-portal/surveys" element={<SurveyResults />} />
                  <Route path="/admin-portal/messages" element={<Messages />} />
                  <Route path="/admin-portal/reports" element={<Reports />} />
                  <Route path="/admin-portal/succession" element={<SuccessionPlanning />} />
                  {/* Manager Portal Routes */}
                  <Route path="/manager-portal/team" element={<TeamMembers />} />
                  <Route path="/manager-portal/attendance" element={<Attendance />} />
                  <Route path="/manager-portal/timeoff" element={<TimeOff />} />
                  <Route path="/manager-portal/performance" element={<Performance />} />
                  <Route path="/manager-portal/approvals" element={<Approvals />} />
                  <Route path="/manager-portal/goals" element={<Goals />} />
                  <Route path="/manager-portal/reports" element={<ManagerReports />} />
                  <Route path="/manager-portal/messages" element={<Messages />} />
                  <Route path="/manager-portal/succession" element={<SuccessionPlanning />} />
                  {/* Employee Portal Routes */}
                  <Route path="/employee-portal/profile" element={<EmployeeProfile />} />
                  <Route path="/employee-portal/payslips" element={<Payslips />} />
                  <Route path="/employee-portal/leave-requests" element={<LeaveRequests />} />
                  <Route path="/employee-portal/expense-claims" element={<ExpenseClaims />} />
                  <Route path="/employee-portal/training" element={<Training />} />
                  <Route path="/employee-portal/announcements" element={<Announcements />} />
                  <Route path="/employee-portal/wellbeing-survey" element={<WellbeingSurvey />} />
                  <Route path="/employee-portal/hr-faq" element={<HRFaq />} />
                  <Route path="/employee-portal/ai-assistant" element={<AIAssistant />} />
                  <Route path="/employee-portal/messages" element={<Messages />} />
                  <Route path="/employee-portal/reports" element={<Reports />} />
                  {/* Recruiter Portal Routes */}
                  <Route path="/recruiter-portal/jobs" element={<JobPostings />} />
                  <Route path="/recruiter-portal/candidates" element={<CandidateScreening />} />
                  <Route path="/recruiter-portal/interviews" element={<InterviewScheduling />} />
                  <Route path="/recruiter-portal/offers" element={<OfferManagement />} />
                  <Route path="/recruiter-portal/messages" element={<Messages />} />
                  <Route path="/recruiter-portal/reports" element={<Reports />} />
                  {/* Trainer Portal Routes */}
                  <Route path="/trainer-portal/courses" element={<CourseCreation />} />
                  <Route path="/trainer-portal/sessions" element={<TrainingSessions />} />
                  <Route path="/trainer-portal/progress" element={<EmployeeProgress />} />
                  <Route path="/trainer-portal/messages" element={<Messages />} />
                  <Route path="/trainer-portal/reports" element={<Reports />} />
                  {/* Auditor Portal Routes */}
                  <Route path="/auditor-portal/compliance" element={<ComplianceReports />} />
                  <Route path="/auditor-portal/risk" element={<RiskAssessment />} />
                  <Route path="/auditor-portal/audits" element={<InternalAudits />} />
                  <Route path="/auditor-portal/messages" element={<Messages />} />
                  <Route path="/auditor-portal/reports" element={<Reports />} />
                </Route>
                {/* NotFound route (public) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
