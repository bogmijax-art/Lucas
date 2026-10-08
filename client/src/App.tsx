import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyIntro from "./pages/CompanyIntro";
import { PrivacyPolicy, TermsOfService } from "./pages/Legal";
import Dashboard from "./pages/Dashboard";
import { Activity, Appointments, Customers, Notifications, Projects, Tasks } from "./pages/CrudPages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CompanyIntro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/workspace" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="activity" element={<Activity />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
