import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Select, Switch, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { Magazine } from '../types/magazine';

interface EditMagazineFormProps {
  magazine: Magazine;
  onSubmit: (id: string, formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const EditMagazineForm: React.FC<EditMagazineFormProps> = ({
  magazine,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    form.setFieldsValue({
      title: magazine.title,
      description: magazine.description,
      category: magazine.category,
      publishDate: magazine.publishDate,
      isFreeTrial: magazine.isFreeTrial
    });
  }, [magazine, form]);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });

    if (fileList[0]?.originFileObj) {
      formData.append('cover', fileList[0].originFileObj);
    } else {
      formData.append('coverUrl', magazine.coverUrl);
    }

    try {
      await onSubmit(magazine.id, formData);
      message.success('更新成功');
      onCancel();
    } catch (error) {
      message.error('更新失败');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      {/* 表单项与 AdminPanel 中的相同 */}
    </Form>
  );
};

export default EditMagazineForm; 