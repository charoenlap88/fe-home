import { useState, useEffect } from 'react';
import {
  Title,
  Grid,
  Card,
  Text,
  Group,
  ThemeIcon,
  Stack,
  Paper,
  Progress,
  Badge,
  Table,
  Alert,
  LoadingOverlay,
  ScrollArea,
  Divider,
  ActionIcon
} from '@mantine/core';
import {
  IconCpu,
  IconChartPie,
  IconDatabase,
  IconNetwork,
  IconServer,
  IconRefresh,
  IconAlertCircle,
  IconCheck,
  IconPlayerPlay,
  IconPlayerStop
} from '@tabler/icons-react';
import { systemAPI, pm2API, formatters } from '../services/api';

const SystemMonitor = () => {
  const [systemData, setSystemData] = useState(null);
  const [pm2Data, setPm2Data] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSystemData = async () => {
    try {
      setError(null);
      const data = await systemAPI.getAll();
      setSystemData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch system data: ' + err.message);
    }
  };

  const fetchPM2Data = async () => {
    try {
      const [processes, logsData] = await Promise.all([
        pm2API.getProcessList(),
        pm2API.getLogs('all', 30)
      ]);
      setPm2Data(processes);
      setLogs(logsData.logs || []);
    } catch (err) {
      console.warn('PM2 data not available:', err.message);
      setPm2Data([]);
      setLogs(['PM2 not available or no processes running']);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchSystemData(), fetchPM2Data()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !systemData) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>System Monitor</Title>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red">
          {error}
        </Alert>
      )}

      {/* System Overview */}
      {systemData && (
        <>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="lg" radius="md" h={160}>
                <Group justify="space-between" h="100%">
                  <div style={{ flex: 1 }}>
                    <Text c="dimmed" size="sm" fw={500} tt="uppercase">
                      CPU Usage
                    </Text>
                    <Text fw={700} size="xl">
                      {formatters.formatPercentage(systemData.cpu.currentLoad)}
                    </Text>
                    <Progress 
                      value={systemData.cpu.currentLoad} 
                      color={systemData.cpu.currentLoad > 80 ? 'red' : systemData.cpu.currentLoad > 60 ? 'orange' : 'green'} 
                      mt="sm" 
                    />
                  </div>
                  <ThemeIcon color="blue" size={32} radius="md" variant="light">
                    <IconCpu size="1.2rem" />
                  </ThemeIcon>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="lg" radius="md" h={160}>
                <Group justify="space-between" h="100%">
                  <div style={{ flex: 1 }}>
                    <Text c="dimmed" size="sm" fw={500} tt="uppercase">
                      Memory Usage
                    </Text>
                    <Text fw={700} size="xl">
                      {systemData.memory.usedPercentage}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatters.formatBytes(systemData.memory.used)} / {formatters.formatBytes(systemData.memory.total)}
                    </Text>
                    <Progress 
                      value={parseFloat(systemData.memory.usedPercentage)} 
                      color={systemData.memory.usedPercentage > 90 ? 'red' : systemData.memory.usedPercentage > 70 ? 'orange' : 'green'} 
                      mt="sm" 
                    />
                  </div>
                  <ThemeIcon color="green" size={32} radius="md" variant="light">
                    <IconChartPie size="1.2rem" />
                  </ThemeIcon>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="lg" radius="md" h={160}>
                <Group justify="space-between" h="100%">
                  <div style={{ flex: 1 }}>
                    <Text c="dimmed" size="sm" fw={500} tt="uppercase">
                      Disk Usage
                    </Text>
                    {systemData.disk[0] && (
                      <>
                        <Text fw={700} size="xl">
                          {systemData.disk[0].usePercentage.toFixed(1)}%
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatters.formatBytes(systemData.disk[0].used)} / {formatters.formatBytes(systemData.disk[0].size)}
                        </Text>
                        <Progress 
                          value={systemData.disk[0].usePercentage} 
                          color={systemData.disk[0].usePercentage > 90 ? 'red' : systemData.disk[0].usePercentage > 80 ? 'orange' : 'green'} 
                          mt="sm" 
                        />
                      </>
                    )}
                  </div>
                  <ThemeIcon color="orange" size={32} radius="md" variant="light">
                    <IconDatabase size="1.2rem" />
                  </ThemeIcon>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="lg" radius="md" h={160}>
                <Group justify="space-between" h="100%">
                  <div style={{ flex: 1 }}>
                    <Text c="dimmed" size="sm" fw={500} tt="uppercase">
                      System Info
                    </Text>
                    <Text fw={700} size="lg">
                      {systemData.os.distro}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Uptime: {formatters.formatUptime(systemData.os.uptime)}
                    </Text>
                  </div>
                  <ThemeIcon color="purple" size={32} radius="md" variant="light">
                    <IconServer size="1.2rem" />
                  </ThemeIcon>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Top Processes */}
          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="sm">Top Processes</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Process Name</Table.Th>
                  <Table.Th>CPU %</Table.Th>
                  <Table.Th>Memory %</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {systemData.topProcesses.map((process, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{process.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={process.cpu > 50 ? 'red' : process.cpu > 25 ? 'orange' : 'blue'}>
                        {process.cpu.toFixed(1)}%
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={process.mem > 10 ? 'red' : process.mem > 5 ? 'orange' : 'green'}>
                        {process.mem.toFixed(1)}%
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </>
      )}

      {/* PM2 Processes */}
      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="sm">PM2 Processes</Title>
        {pm2Data.length > 0 ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>PID</Table.Th>
                <Table.Th>CPU %</Table.Th>
                <Table.Th>Memory</Table.Th>
                <Table.Th>Restarts</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pm2Data.map((process, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Group gap="sm">
                      <ThemeIcon size="sm" variant="light" color={process.status === 'online' ? 'green' : 'red'}>
                        {process.status === 'online' ? <IconPlayerPlay size="0.8rem" /> : <IconPlayerStop size="0.8rem" />}
                      </ThemeIcon>
                      <Text size="sm" fw={500}>{process.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color={process.status === 'online' ? 'green' : 'red'}>
                      {process.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{process.pid}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{process.cpu}%</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatters.formatBytes(process.memory)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{process.restarts}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
            No PM2 processes found. PM2 might not be installed or no processes are running.
          </Alert>
        )}
      </Paper>

      {/* System Logs */}
      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="sm">Recent Logs</Title>
        <ScrollArea h={250}>
          <Stack gap="xs">
            {logs.slice(0, 20).map((log, index) => (
              <Text key={index} size="xs" ff="monospace" c="dimmed">
                {log}
              </Text>
            ))}
            {logs.length === 0 && (
              <Text size="sm" c="dimmed" ta="center">
                No logs available
              </Text>
            )}
          </Stack>
        </ScrollArea>
      </Paper>
      </Stack>
  );
};

export default SystemMonitor;