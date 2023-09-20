import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, DatePicker, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CommissionApi from '@/lib/commission';


const { Option } = Select;

function EditModal({ visible, onCancel, onOk, editForm, selectedSeller, props }) {
    const queryClient = useQueryClient();
    console.log("editForm", selectedSeller)
    const [form] = Form.useForm();

    const updateMutation = useMutation(
        [""],
        async ({ id, Message }) => {
            await CommissionApi.updateCommission(id, Message);
        },
        {
            onError: (data) => { },
            onSuccess: (data) => {
                notification.open({
                    type: "success",
                    message: "Commission has been updated successfully!",
                    placement: "top",
                });
                queryClient.invalidateQueries(["Commission"]);
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
            title="Edit Commission"
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

                <Form.Item name="buyer" label="Buyer's Commission" rules={[{ required: true, message: 'Enter  Buyer Commission', type: Number }]}>
                    <Input placeholder="Enter Buyer Commission in Percent" />
                </Form.Item>


                <Form.Item name="seller" label="Seller's Commission" rules={[{ required: true, message: 'Enter  Seller Commission', type: Number }]}>
                    <Input placeholder="Enter Seller Commission in Percent " />
                </Form.Item>
                <Form.Item name="shipping" label="Shipping Fee" rules={[{ required: true, message: 'Enter  Shipping Fee', type: Number }]}>
                    <Input placeholder="Enter Shipping Fee  " />
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
