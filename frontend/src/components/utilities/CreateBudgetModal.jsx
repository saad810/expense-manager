import { useState } from 'react';
import {
    Modal,
    Button,
    Form,
    InputNumber,
    Select,
    message,
    DatePicker,
} from 'antd';
import dayjs from 'dayjs';

const categories = [
    { value: 'Food', description: 'Eating out, groceries, etc.' },
    { value: 'Transport', description: 'Fuel, public transport, etc.' },
    { value: 'Rent', description: 'Monthly house rent' },
    { value: 'Utilities', description: 'Electricity, gas, water bills' },
    { value: 'Entertainment', description: 'Movies, games, events' },
    { value: 'Healthcare', description: 'Medicines, doctor visits' },
    { value: 'Others', description: 'Miscellaneous expenses' },
];

export const CreateBudgetModal = ({ isOpen, handleClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            // Add logic to call API to create a budget
            // Example: onCreate(values);
            message.success('Budget created successfully');
            form.resetFields();
            handleClose();
        } catch (err) {
            if (err?.response) message.error(err.response.data.message);
            else if (err?.errorFields) return; // validation error
            else message.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Budget"
            open={isOpen}
            onCancel={handleClose}
            footer={
                <Button type="primary" loading={loading} onClick={handleCreate}>
                    Create
                </Button>
            }
        >
            <Form
                form={form}
                layout="vertical"
                style={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select placeholder="Select category" popupMatchSelectWidth={false}>
                        {categories.map((cat) => (
                            <Select.Option key={cat.value} value={cat.value}>
                                <strong>{cat.value}</strong> — {cat.description}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Budget Limit"
                    name="limit"
                    rules={[{ required: true, message: 'Please enter a budget limit' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Enter limit"
                        addonBefore="Rs"
                    />
                </Form.Item>

                {/* <Form.Item
                    label="Month"
                    name="month"
                    initialValue={dayjs().format('YYYY-MM')}

                    rules={[{ required: true, message: 'Please select a month' }]}
                >
                    <DatePicker.MonthPicker style={{ width: '100%' }} />
                </Form.Item> */}
            </Form>
        </Modal>
    );
};
