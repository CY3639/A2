import { useState, useEffect } from 'react';
import { Container, Title, Loader, Alert, TextInput, Pagination, Button } from '@mantine/core';
import MedicationItem from '../components/MedicationItem';
import MedicationForm from '../components/MedicationForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Medications() {
  const [medications, setMedications] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState({});

  useEffect(() => {
    const fetchMedications = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) { setInitialLoad(false); return; }
      try {
        const params = new URLSearchParams();
        if (search) params.set('activeIngredient', search);
        params.set('page', page);
        params.set('limit', 10);

        const url = `${API_BASE_URL}/medications?${params.toString()}`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        setMedications(data);

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
      finally { setInitialLoad(false); }
    };

    fetchMedications();
  }, [search, page]);

  const createMedication = async( medData) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/medications`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(medData)
      });
      if (!response.ok) throw new Error('Failed to create medication');
    }
    catch (err) { console.error(err); }
  };

  if (initialLoad) return <Loader />;
  if (error) return <Alert color='red'>{error}</Alert>;

  return (
    <Container size='lg'>
      <Title order={2} mb='md'>Medications</Title>

      <TextInput
        placeholder='Search by active ingredient...'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        mb='md'
      />

      <Button mb='md' onClick={() => setModalOpen(true)}> Add Medication </Button>
      <MedicationForm
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createMedication}
      MedicationForm/>

      {medications.map(m => <MedicationItem key={m._id} medication={m} />)}
      {medications.length === 0 && <p>No medications found.</p>}

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

export default Medications;