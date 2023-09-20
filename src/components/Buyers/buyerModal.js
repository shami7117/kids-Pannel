import React, { useState, useRef } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BuyerApi from "@/lib/buyer";

function BuyerModal({ visible, onCancel, onSubmit }) {



  const queryClient = useQueryClient();
  const [form] = Form.useForm();


  const addMutation = useMutation(
    ["Buyers"],
    async (data) => {
      return await BuyerApi.addUser(data);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: data?.message,
          placement: "top",
        });
        queryClient.invalidateQueries(["Buyers"]);

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

      form.resetFields();


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
      title="Add Buyer"
      onCancel={handleCancel}
      footer={[
        // <Button key="submit" type="primary" onClick={handleFormSubmit} className="submit-button hover:bg-[#DB3293]">
        //   Add
        // </Button>,
      ]}
    >
      <Form
        onFinish={handleSubmit}
        layout="vertical" >
        <Form.Item name="firstName" label="Buyer First Name" rules={[{ required: true, message: 'Enter Buyer Name' }]}>
          <Input placeholder="Enter Buyer First Name" />
        </Form.Item>

        <Form.Item name="lastName" label="Buyer Last Name" rules={[{ required: true, message: 'Enter Buyer Name' }]}>
          <Input placeholder="Enter Buyer Last Name" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City Name "
          rules={[{ required: true, message: 'Select City ' }]}
        >
          <Select placeholder="Select City" >

            <Option key="New York" values="New York">New York</Option>
            <Option key="London" values="London">London</Option>
          </Select>


        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
        >
          <Input placeholder="Enter Address" />

        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'Please enter a valid email address!',
            },
            {
              required: true,
              message: 'Email is required!',
            },
          ]}
        >
          <Input placeholder="Enter Email" />

        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject('Phone Number is required');
                }
                const phoneRegex = /^\+[0-9]{1,12}$/;
                if (!phoneRegex.test(value)) {
                  return Promise.reject('Phone Number should start with + and have 1-12 digits');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter Phone Number" />
        </Form.Item>

        <Form.Item
          name="postCode"
          label="Post Code"
          rules={[
            {
              required: true,
              validator: (_, value) =>
                isNaN(value) ? Promise.reject('Post Code should be a valid number') : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="Enter Post Code" />
        </Form.Item>

        <Form.Item
          name="region"
          label="Region"
          rules={[{ required: true, message: 'Select Region ' }]}
        >
          <Select placeholder="Select Region" >

            <Option key="South" values="South">South</Option>
            <Option key="North" values="North">North</Option>
          </Select>


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

export default BuyerModal;
