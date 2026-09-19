import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import PublicShell from './components/layout/PublicShell.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewInspection from './pages/NewInspection.jsx'
import AnalysisResult from './pages/AnalysisResult.jsx'
import InspectionHistory from './pages/InspectionHistory.jsx'
import Reports from './pages/Reports.jsx'
import ReportPage from './pages/ReportPage.jsx'
import Settings from './pages/Settings.jsx'
import VerifyProduct from './pages/public/VerifyProduct.jsx'
import ManufacturerPortal from './pages/public/ManufacturerPortal.jsx'
import ManufacturerDashboard from './pages/public/ManufacturerDashboard.jsx'
import ScanHistory from './pages/public/ScanHistory.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inspection/new" element={<NewInspection />} />
        <Route path="/inspection/analysis/:id" element={<AnalysisResult />} />
        <Route path="/history" element={<InspectionHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Product authentication / anti-counterfeit — public, no inspector
          login required, since consumers and manufacturers use these. */}
      <Route element={<PublicShell />}>
        <Route path="/verify" element={<VerifyProduct />} />
        <Route path="/manufacturers" element={<ManufacturerPortal />} />
        <Route path="/manufacturers/dashboard" element={<ManufacturerDashboard />} />
        <Route path="/scan-history" element={<ScanHistory />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
