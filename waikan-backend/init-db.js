const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保数据库目录存在
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'magazines.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库表
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS magazines (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      coverUrl TEXT,
      category TEXT,
      publishDate TEXT,
      isFreeTrial INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入一些示例数据
  const sampleMagazines = [
    {
      id: '1',
      title: 'The Wall Street Journal 2025年1月2日',
      description: '华尔街日报PDF免费下载',
      coverUrl: '/images/newspapers/wsj-cover.jpg',
      category: 'newspapers',
      publishDate: '2025-01-02',
      isFreeTrial: 1
    },
    {
      id: '2',
      title: 'Australian Geographic January/February 2025',
      description: '澳大利亚地理杂志',
      coverUrl: '/images/magazines/ag-cover.jpg',
      category: 'magazines',
      publishDate: '2025-01-02',
      isFreeTrial: 1
    }
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO magazines (id, title, description, coverUrl, category, publishDate, isFreeTrial)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  sampleMagazines.forEach(magazine => {
    stmt.run(
      magazine.id,
      magazine.title,
      magazine.description,
      magazine.coverUrl,
      magazine.category,
      magazine.publishDate,
      magazine.isFreeTrial
    );
  });

  stmt.finalize();
});

console.log('Database initialized with sample data');

// 关闭数据库连接
db.close(); 