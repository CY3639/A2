import { useState } from 'react';
import { Container, TextInput, PasswordInput, Button, Alert, Title, Select } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('pharmacy_assistant');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const isPharmacist = userRole === 'pharmacist';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, userRole, isPharmacist }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Container size={400} mt='xl'>
      <Title order={2} mb='md'>Register</Title>
      {error && <Alert color='red' mb='sm'>{error}</Alert>}
      <form onSubmit={handleRegister}>
        <TextInput label='Username' value={username}
          onChange={(e) => setUsername(e.target.value)} required mb='sm' />
        <PasswordInput label='Password' value={password}
          onChange={(e) => setPassword(e.target.value)} required mb='sm' />
        <Select label='Role'
          data={[
            { value: 'pharmacist', label: 'Pharmacist' },
            { value: 'pharmacy_assistant', label: 'Pharmacy Assistant' },
          ]}
          value={userRole} onChange={setUserRole} mb='sm'
        />
        <Button type='submit' fullWidth loading={loading}>Register</Button>
      </form>
    </Container>
  );
}
export default Register;