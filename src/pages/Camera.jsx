import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Container, Title, Button, Group, Card, Text, TextInput, Stack, Switch } from '@mantine/core';
import { IconCamera, IconX, IconSettings, IconDeviceMobile } from '@tabler/icons-react';

const Camera = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useRaspberryPi, setUseRaspberryPi] = useState(false);
  const [raspberryPiIP, setRaspberryPiIP] = useState('192.168.1.100');
  const [raspberryPiPort, setRaspberryPiPort] = useState('8080');
  const [showSettings, setShowSettings] = useState(false);
  
  const webcamRef = useRef(null);

  // เริ่มต้นกล้อง
  const startCamera = useCallback(() => {
    setIsLoading(true);
    console.log('กำลังเปิดกล้อง...');
    
    if (useRaspberryPi) {
      console.log(`เชื่อมต่อกล้องจาก Raspberry Pi: ${raspberryPiIP}:${raspberryPiPort}`);
    }
    
    // ใช้ setTimeout เพื่อให้ Webcam component พร้อม
    setTimeout(() => {
      setIsStreaming(true);
      setIsLoading(false);
      console.log('กล้องเปิดแล้ว');
    }, 1000);
  }, [useRaspberryPi, raspberryPiIP, raspberryPiPort]);

  // หยุดกล้อง
  const stopCamera = useCallback(() => {
    setIsStreaming(false);
    console.log('กล้องปิดแล้ว');
  }, []);

  // เมื่อได้ media stream
  const handleUserMedia = useCallback(() => {
    console.log('ได้ media stream แล้ว');
    setIsStreaming(true);
    setIsLoading(false);
  }, []);

  // เมื่อมี error
  const handleUserMediaError = useCallback((error) => {
    console.error('ไม่สามารถเปิดกล้องได้:', error);
    if (useRaspberryPi) {
      alert(`ไม่สามารถเชื่อมต่อกล้องจาก Raspberry Pi ได้\nกรุณาตรวจสอบ:\n1. IP Address: ${raspberryPiIP}\n2. Port: ${raspberryPiPort}\n3. กล้องทำงานอยู่หรือไม่`);
    } else {
      alert('ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึงกล้อง');
    }
    setIsLoading(false);
  }, [useRaspberryPi, raspberryPiIP, raspberryPiPort]);

  // เริ่มต้นกล้องอัตโนมัติ
  React.useEffect(() => {
    const timer = setTimeout(() => {
      startCamera();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [startCamera]);

  // สร้าง URL สำหรับ Raspberry Pi camera
  const getCameraSource = () => {
    if (useRaspberryPi) {
      // ใช้ MJPEG stream จาก Raspberry Pi
      return `http://${raspberryPiIP}:${raspberryPiPort}/stream`;
    }
    return undefined; // ใช้กล้องของคอมพิวเตอร์
  };

  return (
    <Container size="xl">
      <Title order={1} mb="xl" ta="center">
        📸 กล้องถ่ายภาพ
      </Title>

      {/* ปุ่มตั้งค่า */}
      <Group justify="center" mb="md">
        <Button
          variant="outline"
          leftSection={<IconSettings size="1.2rem" />}
          onClick={() => setShowSettings(!showSettings)}
          size="sm"
        >
          {showSettings ? 'ซ่อนตั้งค่า' : 'ตั้งค่า'}
        </Button>
      </Group>

      {/* ตั้งค่ากล้อง Raspberry Pi */}
      {showSettings && (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <Group mb="md">
            <IconDeviceMobile size="1.5rem" color="#c41e3a" />
            <Title order={4}>ตั้งค่ากล้อง Raspberry Pi</Title>
          </Group>
          
          <Stack gap="md">
            <Switch
              label="ใช้กล้องจาก Raspberry Pi"
              checked={useRaspberryPi}
              onChange={(event) => setUseRaspberryPi(event.currentTarget.checked)}
              description="เปิดใช้งานเพื่อเชื่อมต่อกล้องจาก Raspberry Pi แทนกล้องของคอมพิวเตอร์"
            />
            
            {useRaspberryPi && (
              <>
                <TextInput
                  label="IP Address ของ Raspberry Pi"
                  placeholder="192.168.1.100"
                  value={raspberryPiIP}
                  onChange={(event) => setRaspberryPiIP(event.currentTarget.value)}
                  description="IP Address ของ Raspberry Pi ในเครือข่ายเดียวกัน"
                />
                
                <TextInput
                  label="Port"
                  placeholder="8080"
                  value={raspberryPiPort}
                  onChange={(event) => setRaspberryPiPort(event.currentTarget.value)}
                  description="Port ที่ใช้สำหรับ stream กล้อง (ปกติคือ 8080 สำหรับ mjpg-streamer)"
                />
                
                <Text size="sm" c="blue" ta="center">
                  💡 ต้องติดตั้ง mjpg-streamer หรือ similar software บน Raspberry Pi
                </Text>
              </>
            )}
          </Stack>
        </Card>
      )}

      <Group justify="center" mb="xl">
        {!isStreaming ? (
          <Button 
            leftSection={<IconCamera size="1.2rem" />}
            onClick={startCamera}
            size="lg"
            color="blue"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'กำลังเปิดกล้อง...' : 'เปิดกล้อง'}
          </Button>
        ) : (
          <Button 
            onClick={stopCamera}
            size="lg"
            color="red"
            leftSection={<IconX size="1.2rem" />}
          >
            ปิดกล้อง
          </Button>
        )}
      </Group>

      {/* แสดงกล้องแบบ Real-time */}
      {isStreaming && (
        <Card shadow="lg" padding="lg" radius="md" withBorder style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card.Section>
            <div style={{ 
              position: 'relative',
              backgroundColor: '#000',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {useRaspberryPi ? (
                // แสดงกล้องจาก Raspberry Pi
                <img
                  src={getCameraSource()}
                  alt="กล้อง Raspberry Pi"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    minHeight: '500px',
                    objectFit: 'cover'
                  }}
                  onLoad={() => {
                    console.log('โหลดภาพจาก Raspberry Pi สำเร็จ');
                    setIsLoading(false);
                  }}
                  onError={() => {
                    console.error('ไม่สามารถโหลดภาพจาก Raspberry Pi ได้');
                    handleUserMediaError(new Error('Connection failed'));
                  }}
                />
              ) : (
                // แสดงกล้องของคอมพิวเตอร์
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  videoConstraints={{
                    width: 800,
                    height: 600,
                    facingMode: "environment"
                  }}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    minHeight: '500px',
                    objectFit: 'cover'
                  }}
                />
              )}
              
              {/* Overlay แสดงสถานะการทำงาน */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#00ff00',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                ● LIVE
              </div>

              {/* แสดงแหล่งที่มาของกล้อง */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                {useRaspberryPi ? '🍓 Raspberry Pi' : '💻 คอมพิวเตอร์'}
              </div>
            </div>
          </Card.Section>
        </Card>
      )}

      {/* แสดงสถานะการโหลด */}
      {isLoading && (
        <Card shadow="lg" padding="lg" radius="md" withBorder style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📹</div>
            <Text size="lg" fw={500} mb="sm">กำลังเปิดกล้อง...</Text>
            <Text size="sm" c="dimmed">
              {useRaspberryPi 
                ? `เชื่อมต่อจาก ${raspberryPiIP}:${raspberryPiPort}`
                : 'กรุณารอสักครู่'
              }
            </Text>
          </div>
        </Card>
      )}

      {/* แสดงสถานะเมื่อยังไม่ได้ stream */}
      {!isLoading && !isStreaming && (
        <Card shadow="lg" padding="lg" radius="md" withBorder style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔄</div>
            <Text size="lg" fw={500} mb="sm">รอการเปิดกล้อง...</Text>
            <Text size="sm" c="dimmed">กล้องจะเปิดขึ้นมาเองในอีกสักครู่</Text>
            {useRaspberryPi && (
              <Text size="xs" c="blue" mt="xs">
                🍓 ใช้กล้องจาก Raspberry Pi: {raspberryPiIP}:{raspberryPiPort}
              </Text>
            )}
          </div>
        </Card>
      )}
    </Container>
  );
};

export default Camera;