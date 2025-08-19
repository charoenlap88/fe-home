import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Container, Title, Button, Group, Card, Text } from '@mantine/core';
import { IconCamera, IconX } from '@tabler/icons-react';

const Camera = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const webcamRef = useRef(null);

  // เริ่มต้นกล้อง
  const startCamera = useCallback(() => {
    setIsLoading(true);
    console.log('กำลังเปิดกล้อง...');
    
    // ใช้ setTimeout เพื่อให้ Webcam component พร้อม
    setTimeout(() => {
      setIsStreaming(true);
      setIsLoading(false);
      console.log('กล้องเปิดแล้ว');
    }, 1000);
  }, []);

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
    alert('ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึงกล้อง');
    setIsLoading(false);
  }, []);

  // เริ่มต้นกล้องอัตโนมัติ
  React.useEffect(() => {
    const timer = setTimeout(() => {
      startCamera();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [startCamera]);

  return (
    <Container size="xl">
      <Title order={1} mb="xl" ta="center">
        📸 กล้องถ่ายภาพ
      </Title>

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

      {/* แสดงกล้องแบบ Real-time ด้วย react-webcam */}
      {isStreaming && (
        <Card shadow="lg" padding="lg" radius="md" withBorder style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card.Section>
            <div style={{ 
              position: 'relative',
              backgroundColor: '#000',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
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
            <Text size="sm" c="dimmed">กรุณารอสักครู่</Text>
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
          </div>
        </Card>
      )}
    </Container>
  );
};

export default Camera;