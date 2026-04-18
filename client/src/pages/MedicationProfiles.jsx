import { useState, useEffect } from 'react';
import { Container, Title, Loader, Alert, Pagination, Button } from '@mantine/core';
import { useParams } from 'react-router-dom';
import ProfileEntry from '../components/ProfileEntry';
import MedicationProfileForm from '../components/MedicationProfileForm';
 
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
 
function MedicationProfiles() {
  const { id } = useParams(); // reads :id from the URL
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState({});
  const isPharmacist = getIsPharmacist();
 
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      if (!token) { setLoading(false); return; }
      try {
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('limit', 10);       

        const response = await fetch(
          `${API_BASE_URL}/patients/${id}/medicationProfiles?${params.toString()}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setProfiles(data);

        const linkHeader = response.headers.get('Link');
          if (linkHeader) {
            const links = {};
            linkHeader.split(',').forEach(link => {
              const match = link.match(/<([^>]+)>; rel="([^"]+)"/);
              if (match) links[match[2]] = match[1];
            });
          setPaginationLinks(links);
        }
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchProfiles();
  }, [id, page]);
  
const createMedicationProfile = async (profileData) => {
  const token = localStorage.getItem('jwt');
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}/medicationProfiles`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to create profile');
    setPage(1); // triggers useEffect to re-fetch
  } catch (err) { console.error(err); }
};
 
  if (loading) return <Loader />;
  if (error)   return <Alert color='red'>{error}</Alert>;
 
  return (
    <Container size='lg'>
      <Title order={2} mb='md'>Medication Profile</Title>

      { isPharmacist && (
      <Button mb='md' onClick={() => setModalOpen(true)}>Add Medication Profile</Button>      
      )}
      <MedicationProfileForm
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createMedicationProfile}
        />

      {profiles.map(p => <ProfileEntry key={p._id} profile={p} />)}
      {profiles.length === 0 && <p>No profile entries found.</p>}

      <Pagination
        value={page}
        onChange={(newPage) => setPage(newPage)}
        total={
          paginationLinks.last
            ? parseInt(paginationLinks.last.match(/page=(\d+)/)[1], 10)
            : 1
        }
        mt='md'
      />
      
    </Container>
  );
}
export default MedicationProfiles;