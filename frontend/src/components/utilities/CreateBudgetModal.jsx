import { useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Form,
    InputNumber,
    Select,
    message,
    DatePicker,
    Spin,
} from 'antd';
import dayjs from 'dayjs';
import categoryApi from '../../api/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import budgetApi from '../../api/budget';
import toast from 'react-hot-toast';

export const CreateBudgetModal = ({
    isOpen,
    handleClose,
    editingBudget,
    onEdit,
    refetch,
}) => {
    // console.log('Editing Budget:', editingBudget); // Log editingBudget for debugging
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { queryClient } = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.getCategories,
        onSuccess: (data) => {
            console.log(data); // Log categories data if needed
        },
    });

    useEffect(() => {
        if (isOpen && data?.categories) {
            if (editingBudget) {
                // Normalize category ID from different possible structures
                const categoryId =
                    typeof editingBudget.category === 'object'
                        ? editingBudget.category._id
                        : data.categories.find(
                              (cat) =>
                                  cat._id === editingBudget.category ||
                                  cat.name === editingBudget.category
                          )?._id;
                console.log('Category ID:', categoryId); // Log category ID for debugging
                form.setFieldsValue({
                    category: categoryId ?? null,
                    startDate: editingBudget.startDate ? dayjs(editingBudget.startDate) : null,
                    endDate: editingBudget.endDate ? dayjs(editingBudget.endDate) : null,
                    limit: editingBudget.amount ?? null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, editingBudget, data?.categories]);
    

    // Fetch categories

    // useEffect(() => {
    //     if (isOpen && !editingBudget?.length > 0) {
    //         form.resetFields();
    //     }
    // }, [isOpen, editingBudget, form]);

    //   console.log('Categories:', data?.categories); // Log categories for debugging

    // Mutate function for creating budget
    const { mutateAsync: createBudget, isLoading: loadingBudgetCreation } =
        useMutation({
            mutationFn: budgetApi.createBudget,
            onSuccess: (data) => {
                console.log(data);
                refetch()
                toast.success('Budget created successfully');
            },
            onError: (error) => {
                console.error(error);
                message.error('Failed to create budget');
            },
        });

    // Handle form submission for creating or editing a budget
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            console.log('Form values:', values); // Log form values for debugging
            setLoading(true);

            const payload = {
                category: values.category,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
                amount: values.limit,
            };

            if (editingBudget) {
                // Update existing budget if editing
                console.log('Editing budget:', payload);
                await onEdit({ id: editingBudget._id, ...payload });
            } else {
                // Create new budget
                await createBudget(payload);
            }

            queryClient.invalidateQueries(['get-budgets']);
            form.resetFields();
            handleClose();
        } catch (err) {
            if (err?.errorFields) return; // Validation error
            message.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingBudget ? 'Edit Budget' : 'Create Budget'}
            open={isOpen}
            onCancel={handleClose}
            footer={[
                <Button type="default" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button type="primary" loading={loading} onClick={handleSubmit}>
                    {editingBudget ? 'Update' : 'Create'}
                </Button>,
            ]}
        >
            {isLoading ? (
                <Spin spinning={isLoading} tip="Loading categories...">
                    Loading...
                </Spin>
            ) : (
                <Form
                    form={form}
                    layout="vertical"

                >
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select placeholder="Select category" popupMatchSelectWidth={false}>
                            {data?.categories.map((cat) => (
                                <Select.Option key={cat._id} value={cat._id}>
                                    <strong>{cat.description}</strong> — {cat.description}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please select a start date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="End Date"
                        name="endDate"
                        dependencies={['startDate']}
                        rules={[
                            { required: true, message: 'Please select an end date' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value.isAfter(getFieldValue('startDate'))) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('End date must be after start date'));
                                },
                            }),
                        ]}
                    >
                        <DatePicker style={{ width: '100%' }} />
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
                            addonBefore="£"
                        />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};
