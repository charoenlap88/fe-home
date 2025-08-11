import { useState } from 'react';
import { FileText, Folder, Download, Upload, Search } from 'lucide-react';

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

  return (
    <div className="files-page">
      <div className="files-header">
        <h2>จัดการไฟล์</h2>
        <div className="files-actions">
          <button className="btn btn-primary">
            <Upload size={16} />
            อัปโหลด
          </button>
          <button className="btn btn-secondary">
            <Folder size={16} />
            โฟลเดอร์ใหม่
          </button>
        </div>
      </div>

      <div className="files-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="ค้นหาไฟล์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="files-list">
        <div className="files-header-row">
          <div className="file-name">ชื่อไฟล์</div>
          <div className="file-size">ขนาด</div>
          <div className="file-modified">แก้ไขล่าสุด</div>
          <div className="file-actions">การดำเนินการ</div>
        </div>

        {filteredFiles.map((file) => (
          <div key={file.id} className="file-row">
            <div className="file-name">
              <div className="file-icon">
                {file.type === 'folder' ? (
                  <Folder size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <span>{file.name}</span>
            </div>
            <div className="file-size">{file.size}</div>
            <div className="file-modified">{file.modified}</div>
            <div className="file-actions">
              <button className="btn-icon" title="ดาวน์โหลด">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="empty-state">
          <FileText size={48} />
          <p>ไม่พบไฟล์ที่ค้นหา</p>
        </div>
      )}
    </div>
  );
};

export default Files;