import { useState, useEffect } from 'react';
import { Container, Title, Text, Card, Stack, Group, Badge, Button, Alert, Loader, Center } from '@mantine/core';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AdminApproval() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });
      if (!res.ok) throw new Error('Failed to fetch pending users');
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (userId) => {
    setApprovingId(userId);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });
      if (!res.ok) throw new Error('Approval failed');
      // Remove the approved user from local state immediately
      setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.message);
    } finally {
      setApprovingId(null);
    }
  };

  const handleDecline = async (userId) => {
    setApprovingId(userId);
    try {
        const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/decline`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        });
        if (!res.ok) throw new Error('Decline failed');
        setPendingUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
        setError(err.message);
    } finally {
        setApprovingId(null);
    }
  };

  return (
    <Container size={600} mt='xl'>
      <Title order={2} mb='xs'>Pending Approvals</Title>
      <Text c='dimmed' mb='lg'>Users awaiting access to the system.</Text>

      {error && <Alert color='red' mb='md'>{error}</Alert>}

      {loading ? (
        <Center mt='xl'><Loader /></Center>
      ) : pendingUsers.length === 0 ? (
        <Text c='dimmed'>No pending users.</Text>
      ) : (
        <Stack gap='sm'>
          {pendingUsers.map((user) => (
            <Card key={user._id} shadow='sm' padding='lg' radius='md' withBorder>
              <Group justify='space-between' align='center'>
                <Stack gap={4}>
                  <Text fw={600}>{user.username}</Text>
                  <Badge color={user.isPharmacist ? 'teal' : 'blue'} variant='light'>
                    {user.userRole}
                  </Badge>
                </Stack>
                <Button
                  color='teal'
                  loading={approvingId === user._id}
                  onClick={() => handleApprove(user._id)}
                >
                  Approve
                </Button>
                <Button
                    color='red'
                    variant='light'
                    loading={approvingId === user._id}
                    onClick={() => handleDecline(user._id)}
                >
                  Decline
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}

export default AdminApproval;