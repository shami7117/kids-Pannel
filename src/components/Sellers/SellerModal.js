import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SellerApi from "@/lib/sellers";

function SellerModal({ visible, onCancel, onSubmit }) {

  const queryClient = useQueryClient();
  const [form] = Form.useForm();


  const addMutation = useMutation(
    ["Sellers"],
    async (data) => {
      return await SellerApi.addSeller(data);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: data?.message,
          placement: "top",
        });
        queryClient.invalidateQueries(["Sellers"]);
        form.validateFields().then((values) => {

          form.resetFields();
        });

        onCancel();
      },
    }
  );


  const [status, setStatus] = useState('Default');
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleSubmit = async (values) => {
    try {
      console.log("VALUES", values)

      addMutation.mutate(values)



    } catch (error) {
      console.error('Form  failed:', error);
    }
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };


  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title="Add Seller"
      onCancel={handleCancel}
      footer={[
        // <Button key="submit" type="primary" onClick={handleFormSubmit} className="submit-button hover:bg-[#DB3293]">
        //   Add
        // </Button>,
      ]}
    >
      <Form onFinish={handleSubmit}
        layout="vertical" >
        {/* <Form.Item name="id" label="Seller ID" rules={[{ required: true, message: 'Enter Seller ID' }]}>
          <Input placeholder="Enter Seller ID" />
        </Form.Item> */}
        <Form.Item name="fName" label="Seller First Name" rules={[{ required: true, message: 'Enter Seller Name' }]}>
          <Input placeholder="Enter Seller First Name" />
        </Form.Item>
        <Form.Item name="lName" label="Seller Last Name" rules={[{ required: true, message: 'Enter Seller Name' }]}>
          <Input placeholder="Enter Seller Last Name" />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Enter Country' }]}>
          <Input placeholder="Enter Country" />
        </Form.Item>
        <Form.Item
          name="register"
          label="Registered As"
          rules={[{ required: true, message: 'Select Category ' }]}
        >
          {/* <DatePicker style={{width: "100%"}}/> */}
          <Select placeholder="Select Category" >

            <Option key="Individual" values="Individual">Individual</Option>
            <Option key="Company" values="Company">Company</Option>
          </Select>

        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
        >
          <Input placeholder="Enter Email" />

        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              validator: (_, value) =>
                isNaN(value) ? Promise.reject('Earn Amount should be a valid number') : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="Enter Phone Number" />
        </Form.Item>
        <Form.Item className=' flex justify-end items-center'>
          <Button
            className="submit-button" size="large"
            type="primary"
            htmlType="submit"
          >
            {addMutation.isLoading
              ? "Submitting..."
              : "Submit"}
          </Button>
        </Form.Item>
      </Form>

    </Modal>
  );
}

export default SellerModal;
