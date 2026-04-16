import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@mantine/core/styles.css';
 
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Medications from './pages/Medications';
import MedicationProfiles from './pages/MedicationProfiles';
import NoPage from './pages/NoPage';
 
function App() {
  return (
    <MantineProvider>
      <BrowserRouter basename='/assessment02'>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='patients' element={<Patients />} />
            <Route path='patients/:id' element={<PatientDetail />} />
            <Route path='medications' element={<Medications />} />
            <Route path='patients/:id/profiles' element={<MedicationProfiles />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
 
export default App;
