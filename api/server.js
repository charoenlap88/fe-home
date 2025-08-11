const express = require('express');
const cors = require('cors');
const si = require('systeminformation');
const { exec } = require('child_process');
const util = require('util');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost', 'http://localhost:80', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Helper function to execute shell commands
const execAsync = util.promisify(exec);

// System Information Endpoints
app.get('/api/system/cpu', async (req, res) => {
  try {
    const cpuData = await si.cpu();
    const cpuLoad = await si.currentLoad();
    const cpuTemp = await si.cpuTemperature();
    
    res.json({
      manufacturer: cpuData.manufacturer,
      brand: cpuData.brand,
      speed: cpuData.speed,
      cores: cpuData.cores,
      physicalCores: cpuData.physicalCores,
      currentLoad: cpuLoad.currentLoad,
      avgLoad: cpuLoad.avgLoad,
      temperature: cpuTemp.main
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/system/memory', async (req, res) => {
  try {
    const memData = await si.mem();
    
    res.json({
      total: memData.total,
      free: memData.free,
      used: memData.used,
      active: memData.active,
      available: memData.available,
      usedPercentage: ((memData.used / memData.total) * 100).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/system/disk', async (req, res) => {
  try {
    const diskData = await si.fsSize();
    
    const formattedDisks = diskData.map(disk => ({
      fs: disk.fs,
      type: disk.type,
      size: disk.size,
      used: disk.used,
      available: disk.available,
      usePercentage: disk.use,
      mount: disk.mount
    }));
    
    res.json(formattedDisks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/system/network', async (req, res) => {
  try {
    const networkData = await si.networkStats();
    
    res.json(networkData.map(net => ({
      iface: net.iface,
      operstate: net.operstate,
      rx_bytes: net.rx_bytes,
      tx_bytes: net.tx_bytes,
      rx_sec: net.rx_sec,
      tx_sec: net.tx_sec
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/system/os', async (req, res) => {
  try {
    const osData = await si.osInfo();
    const uptimeData = await si.time();
    
    res.json({
      platform: osData.platform,
      distro: osData.distro,
      release: osData.release,
      arch: osData.arch,
      hostname: osData.hostname,
      uptime: uptimeData.uptime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PM2 Endpoints
app.get('/api/pm2/list', async (req, res) => {
  try {
    const { stdout } = await execAsync('pm2 jlist');
    const processes = JSON.parse(stdout);
    
    const formattedProcesses = processes.map(proc => ({
      name: proc.name,
      pid: proc.pid,
      status: proc.pm2_env.status,
      cpu: proc.monit.cpu,
      memory: proc.monit.memory,
      uptime: proc.pm2_env.pm_uptime,
      restarts: proc.pm2_env.restart_time,
      instances: proc.pm2_env.instances || 1
    }));
    
    res.json(formattedProcesses);
  } catch (error) {
    // If PM2 is not installed or no processes, return empty array
    res.json([]);
  }
});

app.get('/api/pm2/logs/all', async (req, res) => {
  try {
    const lines = req.query.lines || 50;
    
    const { stdout } = await execAsync(`pm2 logs --lines ${lines} --nostream`);
    
    res.json({
      process: 'all',
      logs: stdout.split('\n').filter(line => line.trim() !== '')
    });
  } catch (error) {
    res.json({
      process: 'all',
      logs: ['No PM2 processes found or PM2 not installed']
    });
  }
});

app.get('/api/pm2/logs/:name', async (req, res) => {
  try {
    const processName = req.params.name;
    const lines = req.query.lines || 50;
    
    const { stdout } = await execAsync(`pm2 logs ${processName} --lines ${lines} --nostream`);
    
    res.json({
      process: processName,
      logs: stdout.split('\n').filter(line => line.trim() !== '')
    });
  } catch (error) {
    res.json({
      process: req.params.name,
      logs: ['No PM2 processes found or PM2 not installed']
    });
  }
});

// Get system processes (alternative to PM2)
app.get('/api/system/processes', async (req, res) => {
  try {
    const processes = await si.processes();
    
    const topProcesses = processes.list
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 10)
      .map(proc => ({
        pid: proc.pid,
        name: proc.name,
        cpu: proc.cpu,
        mem: proc.mem,
        priority: proc.priority,
        state: proc.state
      }));
    
    res.json(topProcesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all system stats at once
app.get('/api/system/all', async (req, res) => {
  try {
    const [cpu, memory, disk, network, os, processes] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.osInfo(),
      si.processes()
    ]);

    res.json({
      cpu: {
        currentLoad: cpu.currentLoad,
        avgLoad: cpu.avgLoad
      },
      memory: {
        total: memory.total,
        used: memory.used,
        free: memory.free,
        usedPercentage: ((memory.used / memory.total) * 100).toFixed(2)
      },
      disk: disk.map(d => ({
        fs: d.fs,
        size: d.size,
        used: d.used,
        usePercentage: d.use,
        mount: d.mount
      })),
      network: network.map(n => ({
        iface: n.iface,
        operstate: n.operstate,
        rx_sec: n.rx_sec,
        tx_sec: n.tx_sec
      })),
      os: {
        platform: os.platform,
        distro: os.distro,
        hostname: os.hostname,
        uptime: os.uptime
      },
      topProcesses: processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 5)
        .map(p => ({
          name: p.name,
          cpu: p.cpu,
          mem: p.mem
        }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📊 System monitoring endpoints available at:`);
  console.log(`   - http://localhost:${PORT}/api/system/all`);
  console.log(`   - http://localhost:${PORT}/api/pm2/list`);
  console.log(`   - http://localhost:${PORT}/api/health`);
});