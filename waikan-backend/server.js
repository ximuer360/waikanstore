const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const dbPath = path.join(__dirname, 'data', 'magazines.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS magazines (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    coverUrl TEXT,
    category TEXT,
    publishDate TEXT,
    isFreeTrial INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Upload request body:', req.body);
    const category = req.body.category || 'default';
    const dir = path.join(__dirname, 'public', 'images', category);
    require('fs').mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '_' + file.originalname;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Type'],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// 添加一个中间件来打印请求信息
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// 添加一个中间件来处理图片 URL
app.use((req, res, next) => {
  if (req.url.startsWith('/images/') && !req.url.includes('..')) {
    const imagePath = path.join(__dirname, 'public', req.url);
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).send('Image not found');
      }
    });
  } else {
    next();
  }
});

// 添加全局中间件来设置响应头
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// 添加根路由处理
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Waikan API' });
});

// 获取所有杂志
app.get('/api/magazines', (req, res) => {
  db.all('SELECT * FROM magazines ORDER BY publishDate DESC', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Sending magazines:', rows);
    res.json(rows);
  });
});

// 获取单个杂志
app.get('/api/magazines/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM magazines WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Magazine not found' });
      return;
    }
    res.json(row);
  });
});

// 更新杂志信息
app.put('/api/magazines/:id', upload.single('cover'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, publishDate, isFreeTrial } = req.body;
    
    let coverUrl = req.body.coverUrl;
    if (req.file) {
      coverUrl = `/images/${category}/${req.file.filename}`;
      
      // 删除旧图片
      if (req.body.coverUrl) {
        const oldImagePath = path.join(__dirname, 'public', req.body.coverUrl);
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }

    // 使用 Promise 包装数据库操作
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE magazines 
         SET title = ?, description = ?, coverUrl = ?, category = ?, 
             publishDate = ?, isFreeTrial = ?
         WHERE id = ?`,
        [
          title,
          description,
          coverUrl,
          category,
          publishDate,
          isFreeTrial === 'true' ? 1 : 0,
          id
        ],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    // 获取更新后的记录
    const updatedMagazine = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM magazines WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.json({
      success: true,
      message: 'Magazine updated successfully',
      magazine: updatedMagazine
    });
  } catch (error) {
    console.error('Error in update magazine:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update magazine',
      message: error.message
    });
  }
});

// 删除杂志
app.delete('/api/magazines/:id', async (req, res) => {
  // 在路由开始就设置响应头
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { id } = req.params;
    console.log('Attempting to delete magazine:', id);

    // 先检查杂志是否存在
    const magazine = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM magazines WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error checking magazine:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!magazine) {
      console.log('Magazine not found:', id);
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Magazine not found'
      });
    }

    // 删除数据库记录
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM magazines WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting from database:', err);
          reject(err);
        } else {
          resolve(this);
        }
      });
    });

    // 尝试删除图片文件
    if (magazine.coverUrl) {
      const imagePath = path.join(__dirname, 'public', magazine.coverUrl);
      try {
        fs.unlinkSync(imagePath);
        console.log('Successfully deleted image:', imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
        // 继续执行，即使图片删除失败
      }
    }

    console.log('Successfully deleted magazine:', id);
    return res.json({
      success: true,
      message: 'Magazine deleted successfully',
      deletedMagazine: magazine
    });

  } catch (error) {
    console.error('Error in delete operation:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'Failed to delete magazine'
    });
  }
});

// 添加新杂志
app.post('/api/magazines', upload.single('cover'), (req, res) => {
  try {
    console.log('Received files:', req.file);
    console.log('Received body:', req.body);

    const { title, description, category, publishDate, isFreeTrial } = req.body;
    
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const coverUrl = `/images/${category}/${req.file.filename}`;
    const id = Date.now().toString();
    
    const stmt = db.prepare(`
      INSERT INTO magazines (id, title, description, coverUrl, category, publishDate, isFreeTrial)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      title,
      description,
      coverUrl,
      category,
      publishDate,
      isFreeTrial === 'true' ? 1 : 0,
      function(err) {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ error: 'Failed to add magazine', details: err.message });
          return;
        }
        
        res.json({
          id,
          title,
          description,
          coverUrl,
          category,
          publishDate,
          isFreeTrial: isFreeTrial === 'true' ? 1 : 0
        });
      }
    );
  } catch (error) {
    console.error('Error in /api/magazines:', error);
    res.status(500).json({ 
      error: 'Failed to add magazine',
      details: error.message 
    });
  }
});

// 添加错误处理中间件
app.use((err, req, res, next) => {
  // 确保不会发送 HTML 错误页面
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  } else {
    next(err);
  }
});

// 添加健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 