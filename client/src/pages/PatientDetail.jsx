import { useState, useEffect } from 'react';
import { Container, Title, Text, Loader, Alert, Button, Card, Stack } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileEntry from '../components/ProfileEntry';
import MedicationProfileForm from '../components/MedicationProfileForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient]     = useState(null);
  const [profiles, setProfiles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh]     = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      if (!token) { setLoading(false); return; }
      try {
        const [patientRes, profilesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/patients/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/patients/${id}/medicationProfiles`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        if (!patientRes.ok) throw new Error('Patient not found');
        if (!profilesRes.ok) throw new Error('Could not load medication profiles');
        const patientData  = await patientRes.json();
        const profilesData = await profilesRes.json();
        setPatient(patientData);
        setProfiles(profilesData);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id, refresh]);

  const createMedicationProfile = async (profileData) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}/medicationProfiles`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ medication: profileData.medicationId, ...profileData })
      });
      if (!response.ok) throw new Error('Failed to add medication profile');
      setRefresh(r => r + 1);
    } catch (err) { console.error(err); }
  };

  if (loading) return <Loader />;
  if (error)   return <Alert color='red'>{error}</Alert>;
  if (!patient) return null;

  return (
    <Container size='lg'>
      <Button variant='subtle' mb='md' onClick={() => navigate('/patients')}>
        Back to Patients
      </Button>
      <Card shadow='sm' padding='xl' radius='md' withBorder mb='md'>
        <Stack gap='sm'>
          <Title order={2}>{patient.firstName} {patient.lastName}</Title>
          <Text>Address: {patient.address}</Text>
          {patient.allergies?.length > 0 && (
            <Text c='red'>Allergies: {patient.allergies.join(', ')}</Text>
          )}
        </Stack>
      </Card>

      <Title order={3} mb='sm'>Medication Profile</Title>
      <Button mb='md' onClick={() => setModalOpen(true)}>Add Medication</Button>

      <MedicationProfileForm
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createMedicationProfile}
      />

      {profiles.length === 0
        ? <Text c='dimmed'>No medication profile entries found.</Text>
        : profiles.map(p => <ProfileEntry key={p._id} profile={p} />)
      }
    </Container>
  );
}

export default PatientDetail;