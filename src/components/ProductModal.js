import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import { UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from "uuid";

import { storage } from '../../Firebase/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const Storage = getStorage(storage);


function ProductModal({ visible, onCancel, onSubmit }) {

  const queryClient = useQueryClient();
  const [form] = Form.useForm();


  const addMutation = useMutation(
    ["Products"],
    async (data) => {
      return await ProductApi.addProduct(data);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: data?.message,
          placement: "top",
        });
        queryClient.invalidateQueries(["Products"]);
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
  const [selectedFile, setSelectedFile] = useState([]);


  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      console.log("NAME", selectedFile.name)
      setSelectedFile(info.file.originFileObj); // Store the selected file in state
    } else if (info.file.status === 'error') {
      // Handle error if file upload fails
    }
  };

  const handleSubmit = async (values) => {
    console.log("FILE", values.file)
    try {

      const storageRef = ref(Storage, `${uuidv4()}_${selectedFile.name}`);

      try {

        await uploadBytes(storageRef, selectedFile);
        const fileUrl = await getDownloadURL(storageRef);
        console.log("UPLOADED URL", fileUrl)

        values['file'] = fileUrl; // Adding a new property

        // setErrors("")
        console.log("UPLOADED DATA", values)
        console.log("VALUES", values)

        console.log("VALUES", values)

        addMutation.mutate(values)



      } catch (error) {
        console.error('failed:', error);
      }
    }
    catch (error) {
      console.error("Form", error);

    }
  }

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
      title="Add Product"
      onCancel={handleCancel}
      footer={[
        // <Button key="submit" type="primary" onClick={handleFormSubmit} className="submit-button hover:bg-[#DB3293]">
        //   Add
        // </Button>,
      ]}
    >
      <Form onFinish={handleSubmit}
        layout="vertical" >

        <Form.Item name="category" label="Product Category" rules={[{ required: true, message: 'Select Product Category' }]}>
          <Select
            placeholder="Select Category"
            dropdownStyle={{ backgroundColor: '#ffffff', padding: '3' }}
          // onChange={setStatus}
          // value={status}
          >
            <Option value="afo">AFO System</Option>
            <Option value="abduction">Abduction Bar</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: 'Enter Price' },
            {
              validator: (_, value) => {
                if (value >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject('Price cannot be negative');
              },
            },
          ]}
        >
          <Input placeholder="Enter Price" />
        </Form.Item>


        <Form.Item name="product" label="Product Name" rules={[{ required: true, message: 'Enter Product Name' }]}>
          <Input placeholder="Enter Product Name" />
        </Form.Item>

        <Form.Item name="color" label="Color Name" rules={[{ required: true, message: 'Enter Color Name' }]}>
          <Input placeholder="Enter Color  Name" />
        </Form.Item>
        <Form.Item name="size" label="Size" rules={[{ required: true, message: 'Enter Size' }]}>
          <Input placeholder="Enter Size " />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Enter Description' }]}>
          <Input placeholder="Enter Description " />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Select Status ' }]}
        >
          <Select
            placeholder="Select Status"
            dropdownStyle={{ backgroundColor: '#ffffff', padding: '3' }}
            onChange={setStatus}
            value={status}
          >
            <Option value="Pending">Pending</Option>

            <Option value="Available">Available</Option>
            <Option value="Disabled">Disabled</Option>
          </Select>


        </Form.Item>



        <Form.Item
          name="featured"
          label="Featured"
          rules={[{ required: true, message: 'Select Featured ' }]}
        >
          <Select
            placeholder="Select Featured"
            dropdownStyle={{ backgroundColor: '#ffffff', padding: '3' }}

          >
            <Option value="True">True</Option>

            <Option value="False">False</Option>
          </Select>


        </Form.Item>



        <Form.Item
          name="popular"
          label="Popular"
          rules={[{ required: true, message: 'Select Popular ' }]}
        >
          <Select
            placeholder="Select Popular"
            dropdownStyle={{ backgroundColor: '#ffffff', padding: '3' }}

          >
            <Option value="True">True</Option>

            <Option value="False">False</Option>
          </Select>


        </Form.Item>

        <Form.Item
          style={{ width: "100%" }}
          name="file"
          rules={[
            {
              required: true,
              message: "Input File ",
            },
          ]}
        >
          <Upload maxCount={1}
            onChange={handleFileChange} // Attach the onChange event handler

            className="w-full uploadButton" style={{ width: "100%" }}>
            <Button className="w-full uploadButton" style={{ width: "100%" }} icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
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

export default ProductModal;
