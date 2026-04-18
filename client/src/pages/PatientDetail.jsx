import { useState, useEffect } from 'react';
import { Container, Title, Text, Loader, Alert, Button, Card, Stack, Modal, Group } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileEntry from '../components/ProfileEntry';
import MedicationProfileForm from '../components/MedicationProfileForm';
import PatientForm from '../components/PatientForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getIsPharmacist = () => {
  const token = localStorage.getItem('jwt');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.isPharmacist === true;
  } catch {
    return false;
  }
};

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient]     = useState(null);
  const [profiles, setProfiles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [refresh, setRefresh]     = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const isPharmacist = getIsPharmacist();

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
        body: JSON.stringify({ medication: profileData.medication, ...profileData })
      });
      if (!response.ok) throw new Error('Failed to add medication profile');
      setRefresh(r => r + 1);
    } catch (err) { console.error(err); }
  };

  const editProfile = async (profileId, updatedData) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}/medicationProfiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update medication profile');
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const ceaseMedication = async (profileId) => {
    const token = localStorage.getItem('jwt');
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_BASE_URL}/patients/${id}/medicationProfiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ endDate: today }),
      });
      if (!response.ok) throw new Error('Failed to cease medication');
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const updatePatient = async (patientData) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      if (!response.ok) throw new Error('Failed to update patient');
      setRefresh(r => r + 1);
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePatient = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete patient');
      navigate('/patients');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProfile = async (profileId) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}/medicationProfiles/${profileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete medication profile');
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
    }
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
          <Group justify='space-between' align='flex-start'>
            <Title order={2}>{patient.firstName} {patient.lastName}</Title>
            {isPharmacist && (
              <Group>
                <Button variant='light' onClick={() => setEditModalOpen(true)}>
                  Edit Patient
                </Button>
                <Button color='red' variant='light' onClick={() => setDeleteModalOpen(true)}>
                  Delete Patient
                </Button>
              </Group>
            )}
          </Group>
          <Text>Address: {patient.address}</Text>
        </Stack>
      </Card>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title='Delete Patient'
        centered
      >
        <Text mb='md'>Are you sure? <br />
          All the medication profile(s) will also be deleted, too.</Text>
        <Group justify='flex-end'>
          <Button variant='default' onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button color='red' onClick={deletePatient}>Delete</Button>
        </Group>
      </Modal>

      <PatientForm
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={updatePatient}
        patient={patient}
      />

      <Title order={3} mb='sm'>Medication Profile</Title>
      {isPharmacist && (
        <Button mb='md' onClick={() => setModalOpen(true)}>Add Medication</Button>
      )}

      <MedicationProfileForm
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createMedicationProfile}
      />

      {profiles.length === 0
        ? <Text c='dimmed'>No medication profile entries found.</Text>
        : profiles.map(p => (
            <ProfileEntry
              key={p._id}
              profile={p}
              onCease={ceaseMedication}
              onDelete={deleteProfile}
              onEdit={editProfile}
            />
          ))
      }
    </Container>
  );
}

export default PatientDetail;