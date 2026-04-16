import { useState, useEffect } from 'react';
import { Container, Title, Loader, Alert, Button, TextInput, Select, Group, Pagination } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import PatientCard from '../components/PatientCard';
import PatientForm from '../components/PatientForm';
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]= useState(true);
  const [error, setError]= useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState({});
  const navigate = useNavigate();
 
  useEffect(() => {
  fetchPatients(search);
  }, [search, sortBy, sortOrder, page]);

  const fetchPatients = async (searchTerm = '') => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    if (!token) { setLoading(false); return; }
    try {
        const params = new URLSearchParams();
        if (searchTerm) params.set('name', searchTerm);
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
    finally { setLoading(false); }
};
 
  const createPatient = async (patientData) => {
  const token = localStorage.getItem('jwt');
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    if (!response.ok) throw new Error('Failed to create patient');
    fetchPatients(search);
  } catch (err) { console.error(err); }
};
 
  if (loading) return <Loader />;
  if (error)   return <Alert color='red'>{error}</Alert>;
 
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
            setPage(1); // reset to first page on new search/input
        }}
        mb='md'
      />

      <Group mb='md'>
        <Select label='Sort by'
            data={[{ value: 'lastName', label: 'Last name' }, { value: 'firstName', label: 'First name' }]}
            value={sortBy} onChange={setSortBy} w={160}
        />
        <Select label='Order'
            data={[{ value: 'asc', label: 'A to Z' }, { value: 'desc', label: 'Z to A' }]}
            value={sortOrder} onChange={setSortOrder} w={120}
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