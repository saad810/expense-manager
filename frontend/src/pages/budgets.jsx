import React, { useEffect, useState } from 'react';
import { Button, Table, Grid, Tooltip, message, Flex } from 'antd';
import { IoMdRefresh, IoMdAdd, IoMdTrash, IoMdCreate } from 'react-icons/io';
import { PageWrapper } from '../components/common/layout';
import { CreateBudgetModal } from '../components/utilities/CreateBudgetModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import budgetApi from '../api/budget';
import getDateLabel from '../utils/date';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const Budgets = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['get-budgets'],
    queryFn: budgetApi.getBudgets,
    onSuccess: (data) => {
      console.log('Fetched data:', data);
    },
    onError: (error) => {
      console.error('Error fetching budgets:', error);
      message.error('Failed to load budgets');
    },
  });

  const { mutateAsync: deleteBudget,isLoading:loadDeletingBudget } = useMutation({
    mutationFn: budgetApi.deleteBudget,
    onSuccess: (data) => {
      console.log('Budget deleted:', data);
      message.success('Budget deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting budget:', error);
      message.error('Failed to delete budget');
    }
  });

  const { mutateAsync: editBudget } = useMutation({
    mutationFn: budgetApi.updateBudget,
    onSuccess: (data) => {
      console.log('Budget updated:', data);
      message.success('Budget updated successfully');
    },
    onError: (error) => {
      console.error('Error updating budget:', error);
      message.error('Failed to update budget');
    }
  });

  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  

  useEffect(() => {
    if (data?.budgets) {
      setBudgets(data.budgets);
    }
  }, [data]);

  const handleRefresh = async () => {
    await refetch();
    toast.success('Budgets refreshed successfully');
  };

  const handleAddEditBudget = (budget) => {
    if (editingBudget) {
      // Edit existing budget
      editBudget(budget);
    } else {
      // Add new budget
    }
    setEditingBudget(null);
    setIsModalOpen(false);
    message.success('Budget saved successfully');
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
    refetch();
    message.success('Budget deleted successfully');
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };


  const columns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    {
      title: 'Date Created',
      key: 'dateLabel',
      render: (_, record) => {
        const friendly = getDateLabel(record.startDate);
        const actualDate = dayjs(record.startDate).format('DD-MM-YY');
        return (
          <Tooltip title={actualDate}>
            <span>{friendly}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'End Date',
      key: 'dateLabel',
      render: (_, record) => {
        const friendly = getDateLabel(record.endDate);
        const actualDate = dayjs(record.endDate).format('DD-MM-YY');
        return (
          <Tooltip title={actualDate}>
            <span>{friendly}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Tooltip title="Edit">
            <Button
              icon={<IoMdCreate />}
              onClick={() => handleEdit(record)}
              shape="circle"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<IoMdTrash />}
              onClick={() => handleDelete(record._id)}
              shape="circle"
              size="small"
              danger
            />
          </Tooltip>
        </div>
      ),
    },
  ];


  return (
    <PageWrapper
      title="Budget"
      description="Manage your budgets here."
      action={
        <Flex
          justify={screens.xs ? 'center' : 'end'}
          align="middle"
          wrap="wrap"
          gap={12}
        >
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
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            icon={<IoMdAdd />}
          >
            Add Budget
          </Button>
        </Flex>

      }
    >

      <Table
        dataSource={budgets}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={true}
        scroll={{ x: 'max-content' }}
      />

      <CreateBudgetModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        editingBudget={editingBudget}
        onEdit={handleAddEditBudget}
        refetch = {refetch}
      />
    </PageWrapper>
  );
};

export default Budgets;
