import React, { useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select, Button, notification } from 'antd';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderApi from '@/lib/order';
const { Option } = Select;

function OrderModal({ visible, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const queryClient = useQueryClient();


  const addMutation = useMutation(
    ["Orders"],
    async (data) => {
      return await OrderApi.addOrder(data);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: data?.message,
          placement: "top",
        });
        queryClient.invalidateQueries(["Orders"]);
        form.validateFields().then((values) => {

          form.resetFields();
        });

        onCancel();
      },
    }
  );

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return { backgroundColor: '#49E258' };
      case 'In Progress':
        return { backgroundColor: '#F0E74A' };
      case 'Cancelled':
        return { backgroundColor: '#D94B38' };
      default:
        return { backgroundColor: '#2668E81A' };
    }
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };



  const handleSubmit = async (values) => {
    try {
      console.log("VALUES", values)

      addMutation.mutate(values)

    }
    catch (error) {
      console.error("Form", error);

    }
  }


  return (
    <Modal
      visible={visible}
      title="Create Order"
      onCancel={handleCancel}
      footer={[

      ]}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="orderId" label="Order ID" rules={[{ required: true, type: 'string', message: 'Enter orderId' }]}>
          <Input placeholder="Enter Order ID" />
        </Form.Item>
        <Form.Item name="fName" label="Customer" rules={[{ required: true, type: 'string', message: 'Enter Customer Name' }]}>
          <Input placeholder="Enter Customer Name" />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Enter Amount' },
            {
              validator: (_, value) => {
                if (value >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject('Amount cannot be negative');
              },
            },
          ]}
        >
          <Input placeholder="Enter Amount" />
        </Form.Item>

        <Form.Item name="payment" rules={[{ required: true, type: 'string', message: 'Select Payment method' }]} label="Payment Method">
          <Radio.Group onChange={(e) => handlePaymentMethodChange(e.target.value)} value={paymentMethod}>
            <Radio value="paypal">PayPal</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="date" label="Order Date" rules={[{ required: true, type: 'date', message: 'Select a date' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select
            defaultValue="New"
            dropdownStyle={{ backgroundColor: '#ffffff', padding: '3' }}
          >
            <Option
              value="New"
              style={{
                background: '#2668E81A',
                transition: 'background-color 0.3s ease',
              }}
            >
              New
            </Option>
            <Option
              value="In Progress"
              style={{
                background: '#FFF9F4',
                transition: 'background-color 0.3s ease',
              }}
            >
              In Progress
            </Option>
            <Option
              value="Completed"
              style={{
                background: '#E826261A',
                transition: 'background-color 0.3s ease',
              }}
            >
              Completed
            </Option>
            <Option
              value="Cancelled"
              style={{
                background: '#36E82617',
                transition: 'background-color 0.3s ease',
              }}
            >
              Cancelled
            </Option>
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

export default OrderModal;
