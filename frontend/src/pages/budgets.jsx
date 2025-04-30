import React, { useState } from 'react';
import { Button, Input, Table, Modal, Form, message, Flex, Tooltip } from 'antd';
import { IoMdRefresh, IoMdAdd, IoMdTrash, IoMdCreate } from 'react-icons/io';
import { PageWrapper } from '../components/common/layout';
import { CreateBudgetModal } from '../components/utilities/CreateBudgetModal';

// Budget component
const Budgets = () => {
  // Sample data for budgets
  const initialBudgets = [
    { id: 1, category: 'Groceries', amount: 5000, spending: 1500 },
    { id: 2, category: 'Entertainment', amount: 2000, spending: 800 },
    { id: 3, category: 'Utilities', amount: 3000, spending: 2000 },
  ];

  const [budgets, setBudgets] = useState(initialBudgets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState({ category: '', amount: '', spending: '' });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingBudget((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefresh = () => {
    setBudgets(initialBudgets); // Reset to initial data
    message.success('Budgets refreshed successfully');
  }

  // Add or Edit Budget
  const handleAddEditBudget = () => {
    if (editingBudget.id) {
      // Edit existing budget
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.id === editingBudget.id ? editingBudget : budget
        )
      );
    } else {
      // Add new budget
      setBudgets((prev) => [
        ...prev,
        { ...editingBudget, id: Date.now() }, // Unique id using Date.now()
      ]);
    }
    setIsModalOpen(false);
    message.success('Budget saved successfully');
  };

  // Open the modal to add or edit a budget
  // const openModal = (budget = { category: '', amount: '', spending: '' }) => {
  //   setEditingBudget(budget);
  //   setIsModalOpen(true);
  // };

  // Delete a budget
  const handleDelete = (id) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    message.success('Budget deleted successfully');
  };

  // Budget columns for the table
  const columns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Spending', dataIndex: 'spending', key: 'spending' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Flex gap={8}>
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
      title={'Budgets'}
      description={'Manage your budgets here.'}
      action={
        <Flex justify="end" align="middle" gap={12}>
          <Button
            type="default"
            icon={<IoMdRefresh size={20} />}
            onClick={handleRefresh} // Trigger refresh on click
          >

          </Button>
          <Button type="primary" onClick={() => setIsModalOpen(true)} icon={<IoMdAdd />}>
            Add Budget
          </Button>

        </Flex>

      }
    >
      <Table
        dataSource={budgets}
        columns={columns}
        rowKey="id"
        pagination={false}
        style={{ marginBottom: 20 }}
      />

      {
        isModalOpen && (
          <CreateBudgetModal
          isOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          onCreate={handleAddEditBudget}
          editingBudget={editingBudget}
           
           />
        )
          
      }

    </PageWrapper>



  );
};

export default Budgets;
