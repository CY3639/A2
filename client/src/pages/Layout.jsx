import { useState, useMemo } from 'react';
import { AppShell, Container, Group, Anchor, Text } from '@mantine/core';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

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

const links = [
  { link: '/', label: 'Home' },
  { link: '/patients', label: 'Patients' },
  { link: '/medications', label: 'Medications' },
];
 
function Layout() {
  const [active, setActive] = useState('/');
  const location = useLocation();  // to read isAuthenticated fresh on every render
  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => !!localStorage.getItem('jwt'), [location]);
  const isPharmacist = useMemo(() => isAuthenticated ? getIsPharmacist() : false, [isAuthenticated]);
 
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };
 
  const items = links.map((link) => (
    <Anchor
      key={link.label}
      component={Link}
      to={link.link}
      onClick={() => setActive(link.link)}
      style={{ marginRight: '15px' }}
      c={active === link.link ? 'navy' : 'gray'}
    >
      {link.label}
    </Anchor>
  ));
 
  return (
    <AppShell header={{ height: 55 }} padding='md'>
      <AppShell.Header>
        <Container size='lg'>
          <Group justify='space-between' h={55} align='center'>
            <Anchor component={Link} to='/' size='xl' fw={700} c='blue'>MedProfile</Anchor>
            <Group gap='xs' align='center'>
              {items}
              {isPharmacist && (
                <Anchor component={Link} to='/admin' c='blue'>Approvals</Anchor>
              )}
              {!isAuthenticated ? (
                <>
                  <Anchor component={Link} to='/login' c='blue'>Login</Anchor>
                  <Anchor component={Link} to='/register' c='blue'>Register</Anchor>
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