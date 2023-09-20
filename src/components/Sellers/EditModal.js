import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, DatePicker, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SellerApi from "@/lib/sellers";


const { Option } = Select;

function EditModal({ visible, onCancel, onOk, editForm, selectedSeller, props }) {
  const queryClient = useQueryClient();
  console.log("editForm", selectedSeller)
  const [form] = Form.useForm();

  const updateMutation = useMutation(
    ["Sellers"],
    async ({ id, Seller }) => {
      await SellerApi.updateSeller(id, Seller);
    },
    {
      onError: (data) => { },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Seller updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Sellers"]);
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
        id: selectedSeller.id,
        Seller: values,
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
      title="Edit Seller"
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
        layout="vertical" initialValues={selectedSeller}>
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
          <Select placeholder="Select Category" >

            <Option key="Individual" values="Individual">Individual</Option>
            <Option key="Company" values="Company">Company</Option>
          </Select>


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
