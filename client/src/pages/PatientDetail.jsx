import { useState, useEffect } from 'react';
import { Container, Title, Text, Loader, Alert, Button, Card, Stack } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
 
  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      if (!token) { setLoading(false); return; }
      try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Patient not found');
        const data = await response.json();
        setPatient(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchPatient();
  }, [id]);
 
  if (loading) return <Loader />;
  if (error)   return <Alert color='red'>{error}</Alert>;
  if (!patient) return null;
 
  return (
    <Container size='lg'>
      <Button variant='subtle' mb='md' onClick={() => navigate('/patients')}>
        Back to Patients
      </Button>
      <Card shadow='sm' padding='xl' radius='md' withBorder>
        <Stack gap='sm'>
          <Title order={2}>{patient.firstName} {patient.lastName}</Title>
          <Text>Address: {patient.address}</Text>
          {patient.allergies?.length > 0 && (
            <Text c='red'>Allergies: {patient.allergies.join(', ')}</Text>
          )}
          <Button mt='md'
            onClick={() => navigate(`/patients/${id}/profiles`)}
          >
            View Medication Profile
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
export default PatientDetail;