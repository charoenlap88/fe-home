import { useState, useEffect } from 'react';
import {
  Title,
  Select,
  Table,
  Button,
  Group,
  Stack,
  Paper,
  Badge,
  ActionIcon,
  Text,
  Modal,
  TextInput,
  Textarea,
  Grid,
  Card,
  Alert,
  Switch,
  LoadingOverlay
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconRefresh,
  IconDatabase,
  IconTable,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

const DatabaseManager = () => {
  const [selectedDatabase, setSelectedDatabase] = useState('iot_db');
  const [selectedTable, setSelectedTable] = useState('Device');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Mock databases and tables
  const databases = [
    { value: 'iot_db', label: 'iot_db' },
    { value: 'user_db', label: 'user_db' },
    { value: 'analytics_db', label: 'analytics_db' }
  ];

  const tables = {
    iot_db: [
      { value: 'Device', label: 'Device' },
      { value: 'Sensor', label: 'Sensor' },
      { value: 'Reading', label: 'Reading' }
    ],
    user_db: [
      { value: 'User', label: 'User' },
      { value: 'Profile', label: 'Profile' },
      { value: 'Session', label: 'Session' }
    ],
    analytics_db: [
      { value: 'Event', label: 'Event' },
      { value: 'Metric', label: 'Metric' },
      { value: 'Report', label: 'Report' }
    ]
  };

  // Mock data
  const mockData = {
    Device: [
      {
        id: 1,
        name: 'Main Door',
        type: 'door',
        location: 'front',
        state: 0,
        createdAt: '2025-08-11T10:53:33.082Z',
        updatedAt: '2025-08-11T10:53:33.082Z'
      },
      {
        id: 2,
        name: 'Living Room Light',
        type: 'light',
        location: 'downstairs',
        state: 0,
        createdAt: '2025-08-11T10:53:33.082Z',
        updatedAt: '2025-08-11T10:53:33.082Z'
      },
      {
        id: 3,
        name: 'Bedroom AC',
        type: 'ac',
        location: 'upstairs',
        state: 0,
        createdAt: '2025-08-11T10:53:33.082Z',
        updatedAt: '2025-08-11T10:53:33.082Z'
      },
      {
        id: 4,
        name: 'Front Camera',
        type: 'camera',
        location: 'front',
        state: 1,
        createdAt: '2025-08-11T10:53:33.082Z',
        updatedAt: '2025-08-11T10:53:33.082Z'
      },
      {
        id: 5,
        name: 'Back Camera',
        type: 'camera',
        location: 'back',
        state: 1,
        createdAt: '2025-08-11T10:53:33.082Z',
        updatedAt: '2025-08-11T10:53:33.082Z'
      }
    ]
  };

  useEffect(() => {
    loadData();
  }, [selectedDatabase, selectedTable]);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setData(mockData[selectedTable] || []);
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    open();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSave = async () => {
    if (editingItem) {
      // Update existing item
      setData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...formData, updatedAt: new Date().toISOString() } : item
      ));
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Math.max(...data.map(d => d.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setData(prev => [...prev, newItem]);
    }
    close();
    setEditingItem(null);
    setFormData({});
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      type: '',
      location: '',
      state: 0
    });
    open();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStateColor = (state) => {
    return state === 1 ? 'green' : 'gray';
  };

  const rows = data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>{item.id}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue">
          {item.type}
        </Badge>
      </Table.Td>
      <Table.Td>{item.location}</Table.Td>
      <Table.Td>
        <Badge variant="light" color={getStateColor(item.state)}>
          {item.state === 1 ? 'Active' : 'Inactive'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          {formatDate(item.createdAt)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          {formatDate(item.updatedAt)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleEdit(item)}
            title="Edit"
          >
            <IconEdit size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(item.id)}
            title="Delete"
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Title order={2}>Database Manager</Title>

      {/* Database and Table Selection */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="md">
            <Group mb="md">
              <IconDatabase size="1.2rem" />
              <Text fw={500}>Database:</Text>
            </Group>
            <Select
              data={databases}
              value={selectedDatabase}
              onChange={setSelectedDatabase}
              placeholder="Select database"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="md">
            <Group mb="md">
              <IconTable size="1.2rem" />
              <Text fw={500}>Table:</Text>
            </Group>
            <Select
              data={tables[selectedDatabase] || []}
              value={selectedTable}
              onChange={setSelectedTable}
              placeholder="Select table"
            />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Action Buttons */}
      <Group justify="space-between">
        <Group>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={handleAdd}
          >
            Add New
          </Button>
          <Button
            variant="light"
            leftSection={<IconRefresh size="1rem" />}
            onClick={loadData}
            loading={loading}
          >
            Refresh
          </Button>
        </Group>
        <Text size="sm" c="dimmed">
          {data.length} records found
        </Text>
      </Group>

      {/* Data Table */}
      <Paper withBorder radius="md" style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>State</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" c="dimmed" py="xl">
                    No data available
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Edit/Add Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingItem ? 'Edit Record' : 'Add New Record'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Enter name"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <Select
            label="Type"
            placeholder="Select type"
            data={[
              { value: 'door', label: 'Door' },
              { value: 'light', label: 'Light' },
              { value: 'ac', label: 'Air Conditioner' },
              { value: 'camera', label: 'Camera' },
              { value: 'sensor', label: 'Sensor' }
            ]}
            value={formData.type || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          />

          <TextInput
            label="Location"
            placeholder="Enter location"
            value={formData.location || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />

          <Switch
            label="Active State"
            checked={formData.state === 1}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.currentTarget.checked ? 1 : 0 }))}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Info Alert */}
      <Alert icon={<IconAlertCircle size="1rem" />} color="blue" variant="light">
        <Text size="sm">
          This is a demo database manager. In a real application, this would connect to your actual database API endpoints.
        </Text>
      </Alert>
    </Stack>
  );
};

export default DatabaseManager;