import { useState, useEffect } from 'react';
import { Container, Title, Loader, Alert, Button, TextInput, Select, Group, Pagination } from '@mantine/core';
import PatientCard from '../components/PatientCard';
import PatientForm from '../components/PatientForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Patients() {
  const [patients, setPatients] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState({});
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) { setInitialLoad(false); return; }
      try {
        const params = new URLSearchParams();
        if (search) params.set('name', search);
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);
        params.set('page', page);
        params.set('limit', 10);

        const url = `${API_BASE_URL}/patients?${params.toString()}`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setPatients(data);

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

    fetchPatients();
  }, [search, sortBy, sortOrder, page, refetch]);

  const createPatient = async (patientData) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      if (!response.ok) throw new Error('Failed to create patient');
      setRefetch(r => r + 1); // triggers useEffect without needing fetchPatients outside
    } catch (err) { console.error(err); }
  };

  if (initialLoad) return <Loader />;
  if (error) return <Alert color='red'>{error}</Alert>;

  return (
    <Container size='lg'>
      <Title order={2} mb='md'>Patients</Title>

      <Button mb='md' onClick={() => setModalOpen(true)}>Add Patient</Button>
      <PatientForm
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createPatient}
      />

      <TextInput
        placeholder='Search by patient name...'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        mb='md'
      />

      <Group mb='md'>
        <Select label='Sort by'
          data={[{ value: 'lastName', label: 'Last name (a-z)' }, { value: 'firstName', label: 'First name (a-z)' }]}
          value={sortBy} onChange={setSortBy} w={160}
        />
      </Group>

      {patients.map(p => <PatientCard key={p._id} patient={p} />)}
      {patients.length === 0 && <p>No patients found.</p>}

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

export default Patients;