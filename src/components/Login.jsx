import { useState } from 'react';
import { 
  Paper, 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Alert,
  Center,
  Stack
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_CONFIG } from '../config';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
      // Create user data for session
      const userData = {
        username: username,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      
      login(userData);
      setError('');
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div
      style={{ 
        width: '100vw',
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}
    >
      <Paper withBorder shadow="md" p={30} radius="md" style={{ width: '100%', maxWidth: '420px' }}>
        <Center mb="md">
          <Title order={2}>เข้าสู่ระบบ</Title>
        </Center>
        
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Username"
              placeholder="ใส่ username"
              required
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
            
            <PasswordInput
              label="Password"
              placeholder="ใส่ password"
              required
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
            
            {error && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            )}
            
            <Button 
              type="submit" 
              fullWidth 
              mt="xl"
              loading={loading}
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              variant="gradient"
            >
              เข้าสู่ระบบ
            </Button>
          </Stack>
        </form>
        
        <Text c="dimmed" size="sm" ta="center" mt={10}>
          Username: charoenlap | Password: Ch@roenlap89
        </Text>
      </Paper>
    </div>
  );
};

export default Login;