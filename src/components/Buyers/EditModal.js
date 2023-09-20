import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, DatePicker, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BuyerApi from "@/lib/buyer";


const { Option } = Select;

function EditModal({ visible, onCancel, onOk, editForm, selectedBuyer, props }) {
  const queryClient = useQueryClient();
  console.log("editForm", selectedBuyer)
  const [form] = Form.useForm();

  const updateMutation = useMutation(
    ["Buyers"],
    async ({ id, Buyer }) => {
      await BuyerApi.updateUser(id, Buyer);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: "Buyer has been updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Buyers"]);
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

      updateMutation.mutate({
        id: selectedBuyer.id,
        Buyer: values,
        // slug,
      })

      form.validateFields().then((values) => {

        form.resetFields();
      });


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
  };

  return (
    <Modal
      title="Edit Buyer"
      visible={visible}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
      footer={[
        // <Button key="submit" htmlType="submit" type="primary" typeof="submit" className="submit-button">
        //   Submit
        // </Button>,
      ]}
    >
      <Form form={editForm} onFinish={handleSubmit}
        layout="vertical" initialValues={selectedBuyer}>

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
            {updateMutation.isLoading
              ? "Submitting..."
              : "Submit"}
          </Button>
        </Form.Item>
      </Form>

    </Modal>

  );
}

export default EditModal;
