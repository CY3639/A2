import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientDetailPage from './pages/PatientDetailPage';
import MedicationsPage from './pages/MedicationsPage';
import MedicationProfilePage from './pages/MedicationProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* protected routes - redirect to /login if not authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/patients' element={<PatientsPage />} />
        <Route path='/patients/:id' element={<PatientDetailPage />} />
        <Route path='/medications' element={<MedicationsPage />} />
        <Route path='/profiles/:id' element={<MedicationProfilePage />} />
      </Route>


    </Routes>
  )
}
