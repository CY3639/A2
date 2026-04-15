import { AppShell, Burger, Group, NavLink, Text, Avatar, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, NavLink as RouterNavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  IconDashboard, IconUsers, IconPill,
  IconClipboardList, IconLogout
} from '@tabler/icons-react';
 
const navItems = [
  { label: 'Dashboard',   href: '/',            icon: <IconDashboard size={18} /> },
  { label: 'Patients',    href: '/patients',    icon: <IconUsers size={18} /> },
  { label: 'Medications', href: '/medications', icon: <IconPill size={18} /> },
];
 
export default function AppShellLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
 
  function handleLogout() {
    logout();
    navigate('/login');
  }
 
  return (    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 220, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md' justify='space-between'>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
            <Text fw={700} c='teal.7'>MedProfile</Text>
          </Group>
          <Menu>
            <Menu.Target>
              <Avatar style={{ cursor: 'pointer' }} color='teal' radius='xl'>
                {user?.username?.[0]?.toUpperCase() ?? 'U'}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{user?.username}</Menu.Label>
              <Menu.Item
                leftSection={<IconLogout size={16} />}
                color='red'
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>
 
      <AppShell.Navbar p='xs'>
        {navItems.map(item => (
          <NavLink
            key={item.href}
            component={RouterNavLink}
            to={item.href}
            label={item.label}
            leftSection={item.icon}
            style={({ isActive }) => isActive ? { backgroundColor: 'var(--mantine-color-teal-0)' } : {}}
          />
        ))}
      </AppShell.Navbar>
 
      <AppShell.Main>
        {/* outlet renders the current page's component here */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
