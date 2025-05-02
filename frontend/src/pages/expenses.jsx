import React, { useState } from 'react';
import { PageWrapper } from '../components/common/layout';
import {
  Button,
  Flex,
  Table,
  Tooltip,
  Card,
  Statistic,
  Spin,
  message,
  Row,
  Col,
  Grid,
} from 'antd';
import {
  IoMdRefresh,
  IoMdCreate,
  IoMdTrash,
  IoMdAdd,
} from 'react-icons/io';
import { CreateExpenseModal } from '../components/utilities/CreateExpenseModal';
import moment from 'moment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AnalyticsApi from '../api/analytics';
import expenseApi from '../api/expense';

const { useBreakpoint } = Grid;

const Expenses = () => {
  const screens = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const queryClient = useQueryClient();

  const {
    isLoading: loadingSavingsData,
    data: savingsData,
    refetch: refetchSavingsData,
  } = useQuery({
    queryKey: ['get-analytics-one'],
    queryFn: () => AnalyticsApi.getAnalyticsOne(),
    onError: () => message.error('Failed to load analytics'),
  });

  const {
    data: fetchedExpenses,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['get-expenses'],
    queryFn: () => expenseApi.getall(),
    onError: () => message.error('Failed to load expenses'),
  });

  const { mutateAsync: deleteExpenses } = useMutation({
    mutationFn: expenseApi.deleteExpense,
    onSuccess: () => {
      message.success('Expense deleted successfully');
      refetch();
    },
    onError: () => message.error('Failed to delete expense'),
  });

  const { mutateAsync: updateExpense } = useMutation({
    mutationFn: expenseApi.updateExpense,
    onSuccess: () => {
      message.success('Expense updated successfully');
      refetch();
    },
    // onError: () => message.error('Failed to update expense'),
  });

  const handleRefresh = () => {
    refetch();
    refetchSavingsData();
  };

  const handleEdit = (record) => {
    setEditingExpense(record);
    setIsOpen(true);
  };

  const handleDelete = async (record) => {
    try {
      await deleteExpenses(record._id);
    } catch (error) {
      // Already handled by mutation
    }
  };

  const handleExpenseUpdate = async (expense) => {
    if (expense.id) {
      const { id, ...data } = expense;
      await updateExpense({ id, data });
    }
    setIsOpen(false);
    setEditingExpense(null);
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category || '—',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `Rs ${text}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Flex gap={8}>
          {/* <Tooltip title="Edit">
            <Button
              icon={<IoMdCreate />}
              onClick={() => handleEdit(record)}
              shape="circle"
              size="small"
            />
          </Tooltip> */}
          <Tooltip title="Delete">
            <Button
              icon={<IoMdTrash />}
              onClick={() => handleDelete(record)}
              shape="circle"
              size="small"
              danger
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Expenses"
      description="Manage your expenses here."
      action={
        <Flex justify="end" align="middle" wrap gap={12}>
          <Button
            type="default"
            icon={<IoMdRefresh size={20} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setEditingExpense(null);
              setIsOpen(true);
            }}
            icon={<IoMdAdd />}
          >
            Add Expense
          </Button>
        </Flex>
      }
    >
      {isOpen && (
        <CreateExpenseModal
          isOpen={isOpen}
          handleClose={() => {
            setIsOpen(false);
            setEditingExpense(null);
          }}
          editingExpense={editingExpense}
          onEdit={handleExpenseUpdate}
        />
      )}

      {loadingSavingsData ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card>
              <Statistic
                title="Total Spending"
                value={savingsData?.analytics.totalSpending}
                prefix="Rs"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card>
              <Statistic
                title="Total Budget"
                value={savingsData?.analytics.totalBudget}
                prefix="Rs"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card>
              <Statistic
                title="Overspent Category"
                value={savingsData?.analytics.overspentCategories?.length || 'None'}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card>
              <Statistic
                title="Potential Savings"
                value={savingsData?.analytics.potentialSavings || 0}
                prefix="Rs"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card>
              <Statistic
                title="Remaining Budget"
                value={savingsData?.analytics.remainingBudget}
                prefix="Rs"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Table
        dataSource={fetchedExpenses?.expenses}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
      />
    </PageWrapper>
  );
};

export default Expenses;
