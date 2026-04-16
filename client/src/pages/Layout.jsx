import { useState } from 'react';
import { AppShell, Container, Group, Anchor, Text } from '@mantine/core';
import { Link, Outlet, useNavigate } from 'react-router-dom';
 
const links = [
  { link: '/', label: 'Home' },
  { link: '/patients', label: 'Patients' },
  { link: '/medications', label: 'Medications' },
];
 
function Layout() {
  const [active, setActive] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('jwt');
  });
  const navigate = useNavigate();
 
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    navigate('/');
  };
 
  const items = links.map((link) => (
    <Anchor
      key={link.label}
      component={Link}
      to={link.link}
      onClick={() => setActive(link.link)}
      style={{ marginRight: '15px' }}
      c={active === link.link ? 'teal' : 'gray'}
    >
      {link.label}
    </Anchor>
  ));
 
  return (
    <AppShell header={{ height: 55 }} padding='md'>
      <AppShell.Header>
        <Container size='lg'>
          <Group justify='space-between' h={55} align='center'>
            <Text size='xl' fw={700} c='teal'>MedProfile</Text>
            <Group gap='xs' align='center'>
              {items}
              {!isAuthenticated ? (
                <>
                  <Anchor component={Link} to='/login' c='teal'>Login</Anchor>
                  <Anchor component={Link} to='/register' c='teal'>Register</Anchor>
                </>
              ) : (
                <Anchor component='button' onClick={handleLogout} c='red'>
                  Logout
                </Anchor>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
 
export default Layout;