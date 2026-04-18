import { useState } from 'react';
import { Container, TextInput, PasswordInput, Button, Alert, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }
      const { token } = await response.json();
      localStorage.setItem('jwt', token);
      navigate('/patients');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Container size={400} mt='xl'>
      <Title order={2} mb='md'>Login</Title>
      {error && <Alert color='red' mb='sm'>{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextInput label='Username' value={username}
          onChange={(e) => setUsername(e.target.value)} required mb='sm' />
        <PasswordInput label='Password' value={password}
          onChange={(e) => setPassword(e.target.value)} required mb='sm' />
        <Button type='submit' fullWidth loading={loading}>Log In</Button>
      </form>
    </Container>
  );
}
export default Login;