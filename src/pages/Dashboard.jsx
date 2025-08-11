import {
  Title,
  Grid,
  Card,
  Text,
  Group,
  ThemeIcon,
  Stack,
  Paper,
  List,
  Progress,
  Badge
} from '@mantine/core';
import {
  IconUsers,
  IconFileText,
  IconChartBar,
  IconTrendingUp,
  IconArrowUp,
  IconArrowDown
} from '@tabler/icons-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      positive: true,
      icon: IconUsers,
      color: 'blue'
    },
    {
      title: 'Total Files',
      value: '567',
      change: '+8%',
      positive: true,
      icon: IconFileText,
      color: 'green'
    },
    {
      title: 'Analytics',
      value: '89%',
      change: '-2%',
      positive: false,
      icon: IconChartBar,
      color: 'orange'
    },
    {
      title: 'Growth',
      value: '23.5%',
      change: '+5%',
      positive: true,
      icon: IconTrendingUp,
      color: 'purple'
    }
  ];

  return (
    <Stack gap="xl">
      <Title order={2}>Dashboard</Title>
      
      <Grid>
        {stats.map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" fw={500} tt="uppercase">
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                  <Group gap={4} mt={5}>
                    <ThemeIcon
                      color={stat.positive ? 'green' : 'red'}
                      variant="light"
                      size="sm"
                    >
                      {stat.positive ? <IconArrowUp size="0.8rem" /> : <IconArrowDown size="0.8rem" />}
                    </ThemeIcon>
                    <Text c={stat.positive ? 'green' : 'red'} size="sm" fw={500}>
                      {stat.change}
                    </Text>
                  </Group>
                </div>
                <ThemeIcon color={stat.color} size={38} radius="md" variant="light">
                  <stat.icon size="1.5rem" />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="lg" radius="md">
            <Title order={3} mb="md">ยินดีต้อนรับ, charoenlap!</Title>
            <Text c="dimmed" mb="lg">
              นี่คือหน้า Dashboard ของคุณ คุณสามารถดูข้อมูลสถิติและจัดการระบบได้ที่นี่
            </Text>
            
            <Stack gap="md">
              <div>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={500}>Storage Usage</Text>
                  <Text size="sm" c="dimmed">72%</Text>
                </Group>
                <Progress value={72} color="blue" size="lg" />
              </div>
              
              <div>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={500}>Memory Usage</Text>
                  <Text size="sm" c="dimmed">45%</Text>
                </Group>
                <Progress value={45} color="green" size="lg" />
              </div>
              
              <div>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={500}>CPU Usage</Text>
                  <Text size="sm" c="dimmed">28%</Text>
                </Group>
                <Progress value={28} color="orange" size="lg" />
              </div>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="lg" radius="md">
            <Title order={3} mb="md">กิจกรรมล่าสุด</Title>
            <List spacing="sm" size="sm">
              <List.Item>
                <Group justify="space-between" wrap="nowrap">
                  <Text>เข้าสู่ระบบเมื่อ</Text>
                  <Badge variant="light" size="sm">
                    {new Date().toLocaleTimeString('th-TH')}
                  </Badge>
                </Group>
              </List.Item>
              <List.Item>
                <Group justify="space-between" wrap="nowrap">
                  <Text>อัปเดตโปรไฟล์</Text>
                  <Badge variant="light" color="green" size="sm">
                    2 ชม.
                  </Badge>
                </Group>
              </List.Item>
              <List.Item>
                <Group justify="space-between" wrap="nowrap">
                  <Text>เพิ่มไฟล์ใหม่</Text>
                  <Badge variant="light" color="blue" size="sm">
                    5 ไฟล์
                  </Badge>
                </Group>
              </List.Item>
              <List.Item>
                <Group justify="space-between" wrap="nowrap">
                  <Text>สำรองข้อมูล</Text>
                  <Badge variant="light" color="orange" size="sm">
                    1 วัน
                  </Badge>
                </Group>
              </List.Item>
            </List>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default Dashboard;