import { useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    message,
} from 'antd';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import categoryApi from '../../api/category';
import expenseApi from '../../api/expense';

export const CreateExpenseModal = ({
    isOpen,
    handleClose,
    editingExpense,
    onEdit,
}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.getCategories,
        onSuccess: (data) => {
            console.log('Fetched categories:', data);
        },
    });

    const { mutateAsync: createExpense } = useMutation({
        mutationFn: expenseApi.createExpense,
        onSuccess: () => {
            message.success('Transaction created successfully');
        },
        onError: (error) => {
            console.error(error);
            message.error('Failed to create transaction');
        },
    });

    useEffect(() => {
        if (isOpen && data?.categories) {
            if (editingExpense) {
                const categoryId =
                    typeof editingExpense.category === 'object'
                        ? editingExpense.category._id
                        : data.categories.find(
                            (cat) =>
                                cat._id === editingExpense.category ||
                                cat.name === editingExpense.category
                        )?._id;

                form.setFieldsValue({
                    category: categoryId ?? null,
                    amount: editingExpense.amount ?? null,
                    description: editingExpense.description ?? '',
                    date: editingExpense.date ? dayjs(editingExpense.date) : null,
                    type: editingExpense.type ?? null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, editingExpense, data?.categories, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const payload = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
                expenseType: values.type,
                description: values.description ?? '',
            };
            delete payload.type;

            if (editingExpense) {
                await onEdit({ id: editingExpense._id, ...payload });
            } else {
                await createExpense(payload);
            }

            queryClient.invalidateQueries(['get-expenses']);
            form.resetFields();
            handleClose();
        } catch (err) {
            if (err?.response) message.error(err.response.data.message);
            else if (err?.errorFields) return;
            else message.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingExpense ? 'Edit Transaction' : 'Create Transaction'}
            open={isOpen}
            onCancel={handleClose}
            footer={
                <Button type="primary" loading={loading} onClick={handleSubmit}>
                    {editingExpense ? 'Update' : 'Create'}
                </Button>
            }
        >
            <Form
                form={form}
                layout="vertical"
                style={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
                <Form.Item
                    label="Transaction Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select transaction type' }]}
                >
                    <Select placeholder="Select transaction type">
                        <Select.Option value="expense">Expense</Select.Option>
                        <Select.Option value="income">Income</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select placeholder="Select category" popupMatchSelectWidth={false}>
                        {data?.categories.map((cat) => (
                            <Select.Option key={cat._id} value={cat._id}>
                                <strong>{cat.name}</strong> — {cat.description}
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
                        addonBefore="£"
                    />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} placeholder="Optional description" />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please pick a date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
