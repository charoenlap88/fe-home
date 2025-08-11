import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">1,234</p>
            <span className="stat-change positive">+12%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Files</h3>
            <p className="stat-number">567</p>
            <span className="stat-change positive">+8%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>Analytics</h3>
            <p className="stat-number">89%</p>
            <span className="stat-change negative">-2%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Growth</h3>
            <p className="stat-number">23.5%</p>
            <span className="stat-change positive">+5%</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h3>ยินดีต้อนรับ, charoenlap!</h3>
          <p>นี่คือหน้า Dashboard ของคุณ คุณสามารถดูข้อมูลสถิติและจัดการระบบได้ที่นี่</p>
        </div>

        <div className="recent-activity">
          <h3>กิจกรรมล่าสุด</h3>
          <ul>
            <li>เข้าสู่ระบบเมื่อ {new Date().toLocaleString('th-TH')}</li>
            <li>อัปเดตโปรไฟล์เมื่อ 2 ชั่วโมงที่แล้ว</li>
            <li>เพิ่มไฟล์ใหม่ 5 ไฟล์</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;