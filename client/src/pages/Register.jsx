import { useState } from 'react';
import { Container, TextInput, PasswordInput, Button, Alert, Title, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      userRole: 'pharmacy assistant',
    },
    validate: {
      username: (value) => (value.length === 0 ? 'Username is required' : null),
      password: (value) => (value.length < 4 ? 'Password must be at least 4 characters long' : null),
    },
  });

  const handleRegister = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const isPharmacist = values.userRole === 'pharmacist';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, isPharmacist }),
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
      <form onSubmit={form.onSubmit(handleRegister)}>
        <TextInput label='Username' {...form.getInputProps('username')} required mb="sm" />
        <PasswordInput label='Password' {...form.getInputProps('password')} required mb='sm' />
        <Select label='Role'
          data={[
            { value: 'pharmacist', label: 'Pharmacist' },
            { value: 'pharmacy assistant', label: 'Pharmacy Assistant' },
          ]}
          {...form.getInputProps('UserRole')} mb='sm'
        />
        <Button type='submit' fullWidth loading={loading}>Register</Button>
      </form>
    </Container>
  );
}
export default Register;