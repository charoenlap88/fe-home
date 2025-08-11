# System Monitoring API

Node.js API สำหรับ monitoring system metrics และ PM2 processes

## Features

### System Metrics
- **CPU Usage**: Real-time CPU usage percentage
- **Memory Usage**: RAM usage statistics
- **Disk Usage**: Storage usage information
- **Network Stats**: Network interface statistics
- **OS Information**: Operating system details
- **Process List**: Top CPU-consuming processes

### PM2 Monitoring
- **Process List**: All PM2 managed processes
- **Process Logs**: Recent logs from PM2 processes
- **Status Monitoring**: Process status and health

## API Endpoints

### System Information
```
GET /api/system/all          # Get all system metrics at once
GET /api/system/cpu          # CPU information and usage
GET /api/system/memory       # Memory usage statistics
GET /api/system/disk         # Disk usage information
GET /api/system/network      # Network interface stats
GET /api/system/os           # Operating system info
GET /api/system/processes    # Top processes by CPU usage
```

### PM2 Monitoring
```
GET /api/pm2/list            # List all PM2 processes
GET /api/pm2/logs/:name      # Get logs for specific process
GET /api/pm2/logs            # Get logs for all processes
```

### Health Check
```
GET /api/health              # API health status
```

## Installation & Usage

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Start production server:
```bash
npm start
```

The API server will run on `http://localhost:3001`

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **systeminformation**: System metrics library
- **pm2**: Process manager (for PM2 integration)
- **child_process**: For executing shell commands
- **nodemon**: Development auto-reload (dev dependency)

## Example Response

### GET /api/system/all
```json
{
  "cpu": {
    "currentLoad": 25.5,
    "avgLoad": 20.1
  },
  "memory": {
    "total": 17179869184,
    "used": 8589934592,
    "free": 8589934592,
    "usedPercentage": "50.0"
  },
  "disk": [{
    "fs": "/dev/disk1s1",
    "size": 494384795648,
    "used": 245760000000,
    "usePercentage": 49.7,
    "mount": "/"
  }],
  "os": {
    "platform": "darwin",
    "distro": "macOS",
    "hostname": "MacBook-Pro",
    "uptime": 86400
  }
}
```

## Error Handling

The API includes proper error handling for:
- Network failures
- Permission issues
- Missing PM2 installation
- System information access errors

All errors return appropriate HTTP status codes with descriptive messages.