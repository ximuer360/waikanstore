const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'magazines.db');
const db = new sqlite3.Database(dbPath);

// 迁移数据库
const migrateMagazines = async () => {
  try {
    // 1. 重命名旧表
    await new Promise((resolve, reject) => {
      db.run('ALTER TABLE magazines RENAME TO magazines_old', (err) => {
        if (err && !err.message.includes('no such table')) reject(err);
        resolve();
      });
    });

    // 2. 创建新表
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS magazines (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          coverUrl TEXT,
          category TEXT,
          publishDate TEXT,
          isFreeTrial INTEGER DEFAULT 0,
          downloadUrl TEXT,
          isVip INTEGER DEFAULT 0,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // 3. 复制数据
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO magazines (
          id, title, description, coverUrl, category, 
          publishDate, isFreeTrial, downloadUrl, isVip, createdAt
        )
        SELECT 
          id, title, description, coverUrl, category,
          publishDate, isFreeTrial, NULL as downloadUrl, 0 as isVip, 
          COALESCE(createdAt, CURRENT_TIMESTAMP)
        FROM magazines_old
      `, (err) => {
        if (err && !err.message.includes('no such table')) reject(err);
        resolve();
      });
    });

    // 4. 删除旧表
    await new Promise((resolve, reject) => {
      db.run('DROP TABLE IF EXISTS magazines_old', (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // 5. 如果没有数据，添加一些示例数据
    const count = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM magazines', (err, row) => {
        if (err) reject(err);
        resolve(row.count);
      });
    });

    if (count === 0) {
      // 添加示例数据
      const sampleMagazines = [
        {
          id: Date.now().toString(),
          title: 'Sample Magazine 1',
          description: '这是一个示例杂志',
          coverUrl: '/images/default/sample1.jpg',
          category: 'magazines',
          publishDate: '2024-01-01',
          isFreeTrial: 1,
          downloadUrl: 'https://example.com/sample1.pdf',
          isVip: 0
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Sample Magazine 2',
          description: '这是另一个示例杂志',
          coverUrl: '/images/default/sample2.jpg',
          category: 'newspapers',
          publishDate: '2024-01-02',
          isFreeTrial: 0,
          downloadUrl: null,
          isVip: 1
        }
      ];

      for (const magazine of sampleMagazines) {
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT INTO magazines (
              id, title, description, coverUrl, category,
              publishDate, isFreeTrial, downloadUrl, isVip
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            magazine.id,
            magazine.title,
            magazine.description,
            magazine.coverUrl,
            magazine.category,
            magazine.publishDate,
            magazine.isFreeTrial,
            magazine.downloadUrl,
            magazine.isVip
          ], (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      }
    }

    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
};

// 执行迁移
migrateMagazines();