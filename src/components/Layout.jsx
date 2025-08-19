import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppShell,
  Text,
  UnstyledButton,
  Group,
  Avatar,
  Menu,
  rem,
  Burger,
  ActionIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../contexts/AuthContext';
import {
  IconDashboard,
  IconFileText,
  IconLogout,
  IconUser,
  IconChevronDown,
  IconChartBar,
  IconDatabase,
  IconCamera
} from '@tabler/icons-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: IconDashboard, label: 'Dashboard' },
    { path: '/files', icon: IconFileText, label: 'File' },
    { path: '/system', icon: IconChartBar, label: 'System Monitor' },
    { path: '/db-manager', icon: IconDatabase, label: 'Database' },
    { path: '/camera', icon: IconCamera, label: 'Camera' }
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="lg" fw={600}>Dashboard</Text>
          </Group>
          
          <Group>
            <Group gap={7}>
              <Avatar size={26} radius="xl" />
              <Text size="sm" fw={500}>{user?.username || 'User'}</Text>
            </Group>
            
            <Menu shadow="md" width={120}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg">
                  <IconChevronDown size="1rem" />
                </ActionIcon>
              </Menu.Target>
              
              <Menu.Dropdown>
                <Menu.Item 
                  leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                  onClick={logout}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <UnstyledButton
                key={item.path}
                component={Link}
                to={item.path}
                p="sm"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '4px',
                  marginBottom: '4px',
                  backgroundColor: isActive ? '#e7f5ff' : 'transparent',
                  color: isActive ? '#1971c2' : '#495057',
                  textDecoration: 'none'
                }}
                styles={(theme) => ({
                  root: {
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                    },
                  },
                })}
              >
                <Group>
                  <Icon size="1.2rem" />
                  <Text size="sm" fw={isActive ? 600 : 400}>
                    {item.label}
                  </Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <div style={{ paddingTop: '2rem' }}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;