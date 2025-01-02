import React, { useState } from 'react';
import { Form, Input, Upload, Select, Switch, Button, message, Table, Space, Modal, Popconfirm } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { Magazine } from '../../types/magazine';
import { api } from '../../services/api';

const { Option } = Select;

interface AdminPanelProps {
  onAddMagazine: (magazine: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddMagazine }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(null);

  // 加载杂志列表
  const loadMagazines = async () => {
    try {
      setLoading(true);
      const data = await api.getAllMagazines();
      setMagazines(data);
    } catch (error) {
      message.error('加载杂志列表失败');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMagazines();
  }, []);

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      console.log('Attempting to delete magazine:', id);
      await api.deleteMagazine(id);
      message.success('删除成功');
      await loadMagazines(); // 重新加载列表
    } catch (error) {
      console.error('Delete error:', error);
      message.error('删除失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = (record: Magazine) => {
    setEditingMagazine(record);
    setShowAddForm(true); // 显示模态框
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      category: record.category,
      publishDate: record.publishDate,
      isFreeTrial: record.isFreeTrial
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Magazine) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这本杂志吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ loading: loading }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    if (fileList.length === 0 && !editingMagazine) {
      message.error('请选择封面图片');
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined) {
        formData.append(key, values[key].toString());
      }
    });

    if (fileList[0]?.originFileObj) {
      formData.append('cover', fileList[0].originFileObj);
    } else if (editingMagazine) {
      // 如果是编辑模式且没有新图片，保留原有图片URL
      formData.append('coverUrl', editingMagazine.coverUrl);
    }

    try {
      if (editingMagazine) {
        await api.updateMagazine(editingMagazine.id, formData);
        message.success('更新成功');
      } else {
        await onAddMagazine(formData);
        message.success('添加成功');
      }
      
      setShowAddForm(false);
      setEditingMagazine(null);
      form.resetFields();
      setFileList([]);
      loadMagazines(); // 重新加载列表
    } catch (error) {
      console.error('Error:', error);
      message.error(editingMagazine ? '更新失败' : '添加失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setShowAddForm(true);
            setEditingMagazine(null);
            form.resetFields();
            setFileList([]);
          }}
        >
          添加杂志
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={magazines} 
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingMagazine ? "编辑杂志" : "添加杂志"}
        open={showAddForm || !!editingMagazine}
        onCancel={() => {
          setShowAddForm(false);
          setEditingMagazine(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="例如：The Wall Street Journal 2025年1月2日" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea placeholder="请输入杂志描述" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Option value="newspapers">英文报纸</Option>
              <Option value="magazines">人文地理</Option>
              <Option value="business">商业财经</Option>
              <Option value="entertainment">娱乐时尚</Option>
              <Option value="ebooks">电子书资源</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="publishDate"
            label="发布日期"
            rules={[{ required: true, message: '请输入发布日期' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="isFreeTrial"
            label="是否免费"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="封面图片"
            required={!editingMagazine}
            tooltip="请上传杂志封面图片，建议尺寸 300x400"
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>选择图片</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingMagazine ? '更新' : '添加'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel; 