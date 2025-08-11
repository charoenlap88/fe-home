import { useState } from 'react';
import {
  Title,
  Group,
  Button,
  TextInput,
  Table,
  ActionIcon,
  Text,
  Stack,
  Paper,
  Center,
  ThemeIcon,
  Badge
} from '@mantine/core';
import {
  IconFileText,
  IconFolder,
  IconDownload,
  IconUpload,
  IconSearch,
  IconFolderPlus
} from '@tabler/icons-react';

const Files = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data สำหรับแสดงไฟล์
  const files = [
    { id: 1, name: 'document.pdf', type: 'file', size: '2.5 MB', modified: '2024-01-15' },
    { id: 2, name: 'project-folder', type: 'folder', size: '-', modified: '2024-01-14' },
    { id: 3, name: 'image.jpg', type: 'file', size: '1.2 MB', modified: '2024-01-13' },
    { id: 4, name: 'report.docx', type: 'file', size: '856 KB', modified: '2024-01-12' },
    { id: 5, name: 'data-folder', type: 'folder', size: '-', modified: '2024-01-11' },
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type) => {
    return type === 'folder' ? (
      <ThemeIcon variant="light" color="blue" size="sm">
        <IconFolder size="1rem" />
      </ThemeIcon>
    ) : (
      <ThemeIcon variant="light" color="gray" size="sm">
        <IconFileText size="1rem" />
      </ThemeIcon>
    );
  };

  const rows = filteredFiles.map((file) => (
    <Table.Tr key={file.id}>
      <Table.Td>
        <Group gap="sm">
          {getFileIcon(file.type)}
          <Text size="sm" fw={500}>
            {file.name}
          </Text>
          {file.type === 'folder' && (
            <Badge variant="light" size="xs" color="blue">
              Folder
            </Badge>
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {file.size}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {file.modified}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue" title="ดาวน์โหลด">
            <IconDownload size="1rem" />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>จัดการไฟล์</Title>
        <Group>
          <Button leftSection={<IconUpload size="1rem" />} variant="filled">
            อัปโหลด
          </Button>
          <Button 
            leftSection={<IconFolderPlus size="1rem" />} 
            variant="light"
          >
            โฟลเดอร์ใหม่
          </Button>
        </Group>
      </Group>

      <Paper withBorder p="md" radius="md">
        <TextInput
          placeholder="ค้นหาไฟล์..."
          leftSection={<IconSearch size="1rem" />}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          style={{ maxWidth: 400 }}
        />
      </Paper>

      <Paper withBorder radius="md" p={0}>
        {filteredFiles.length > 0 ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ชื่อไฟล์</Table.Th>
                <Table.Th>ขนาด</Table.Th>
                <Table.Th>แก้ไขล่าสุด</Table.Th>
                <Table.Th>การดำเนินการ</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        ) : (
          <Center p="xl">
            <Stack align="center" gap="md">
              <ThemeIcon size={64} variant="light" color="gray">
                <IconFileText size="2rem" />
              </ThemeIcon>
              <div>
                <Text size="lg" fw={500} ta="center">
                  ไม่พบไฟล์ที่ค้นหา
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  ลองเปลี่ยนคำค้นหาหรือเพิ่มไฟล์ใหม่
                </Text>
              </div>
            </Stack>
          </Center>
        )}
      </Paper>
    </Stack>
  );
};

export default Files;