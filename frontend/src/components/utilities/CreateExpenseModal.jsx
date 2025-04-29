import { useState } from 'react';
import {
    Modal,
    Button,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    message
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

export const CreateExpenseModal = ({ isOpen, handleClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            message.success('Expense created successfully');
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
            title="Create Expense"
            open={isOpen}
            onCancel={handleClose}
            // width={400}
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
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please enter an amount' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Enter amount"
                        addonBefore="Rs"
                    />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} placeholder="Optional description" />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    initialValue={dayjs()}
                    rules={[{ required: true, message: 'Please pick a date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
