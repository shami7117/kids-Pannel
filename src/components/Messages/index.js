import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, DatePicker, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MessageApi from "@/lib/contactUs";


const { Option } = Select;

function EditModal({ visible, onCancel, onOk, editForm, selectedSeller, props }) {
    const queryClient = useQueryClient();
    console.log("editForm", selectedSeller)
    const [form] = Form.useForm();

    const updateMutation = useMutation(
        ["Messages"],
        async ({ id, Message }) => {
            await MessageApi.updateContactUs(id, Message);
        },
        {
            onError: (data) => { },
            onSuccess: (data) => {
                notification.open({
                    type: "success",
                    message: "Message has been updated successfully!",
                    placement: "top",
                });
                queryClient.invalidateQueries(["Messages"]);
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
                Message: values,
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
            title="Edit Message"
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

                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter  Name' }]}>
                    <Input placeholder="Enter Name" />
                </Form.Item>


                <Form.Item
                    name="subject"
                    label="Subject "
                    rules={[{ required: true, message: 'Enter Subject ' }]}
                >

                    <Input placeholder="Enter Subject" />


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
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Message ' }]}
                >


                    <Input placeholder="Enter Message" />

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
