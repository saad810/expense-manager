import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/common/layout';
import { Button, Flex, Table, Select, Tooltip, Card, Statistic } from 'antd';
import { IoMdRefresh, IoMdCreate, IoMdTrash, IoMdAdd } from 'react-icons/io';
import { CreateExpenseModal } from '../components/utilities/CreateExpenseModal';
import moment from 'moment';
import { MdDoNotDisturb } from "react-icons/md";

// Sample expense data
const sampleExpenses = [
  { category: 'Food', amount: 500, date: '2025-03-01', description: 'Groceries' },
  { category: 'Transport', amount: 1500, date: '2025-04-20', description: 'Fuel' },
  { category: 'Rent', amount: 20000, date: '2024-10-01', description: 'Monthly rent' },
  { category: 'Entertainment', amount: 1200, date: '2025-04-15', description: 'Movie tickets' },
  { category: 'Healthcare', amount: 3000, date: '2025-04-01', description: 'Medicine' },
  { category: 'Utilities', amount: 2500, date: '2025-03-15', description: 'Electricity bill' },
  { category: 'Food', amount: 2000, date: '2025-04-25', description: 'Dining out' },
];

// Suggested categories and budget values
const categoryBudgets = {
  Food: 1000,
  Transport: 1000,
  Rent: 20000,
  Entertainment: 1000,
  Healthcare: 2000,
  Utilities: 2500,
};

// Get savings suggestion function
const getSavingsSuggestion = (expenses) => {
  let totalSpending = 0;
  let totalBudget = 0;
  let overspentCategories = [];
  let potentialSavings = [];

  // Calculate overspend or savings
  expenses.forEach((expense) => {
    const budget = categoryBudgets[expense.category] || 1000; // Default budget is 1000 if not defined
    totalSpending += expense.amount;
    totalBudget += budget;

    if (expense.amount > budget) {
      overspentCategories.push(expense.category);
    } else {
      const savings = budget - expense.amount;
      if (savings > 0) potentialSavings.push({ category: expense.category, savings });
    }
  });

  return {
    totalSpending,
    totalBudget,
    overspentCategories: overspentCategories || [],
    potentialSavings: potentialSavings || [],
  };
};

const Expenses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState(sampleExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(sampleExpenses);
  const [dateFilter, setDateFilter] = useState('');
  const [savingsData, setSavingsData] = useState({
    totalSpending: 0,
    totalBudget: 0,
    overspentCategories: [],
    potentialSavings: [],
  });

  useEffect(() => {
    // Update savings suggestions based on current expenses
    setSavingsData(getSavingsSuggestion(expenses));
  }, [expenses]);

  // Handle Refresh Expenses
  const handleRefresh = () => {
    setExpenses([...sampleExpenses]);
    setFilteredExpenses([...sampleExpenses]); // Reset filters on refresh
  };

  // Sorting logic for date categories
  const getDateCategory = (date) => {
    const expenseDate = moment(date);
    const today = moment();
    const diffInDays = today.diff(expenseDate, 'days');

    if (diffInDays === 0) return 'Today';
    if (diffInDays <= 7) return 'Week Ago';
    if (diffInDays <= 30) return 'Month Ago';
    if (diffInDays <= 365) return 'Year Ago';
    return 'Older';
  };

  // Filter expenses based on the selected filter
  const handleDateFilter = (value) => {
    setDateFilter(value);
    if (value === '') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter((expense) => getDateCategory(expense.date) === value));
    }
  };

  // Handle Edit and Delete actions
  const handleEdit = (record) => {
    console.log('Edit expense:', record);
  };

  const handleDelete = (record) => {
    setExpenses(expenses.filter((expense) => expense.date !== record.date || expense.category !== record.category));
    setFilteredExpenses(filteredExpenses.filter((expense) => expense.date !== record.date || expense.category !== record.category));
  };

  // Table columns for displaying expenses
  const columns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `Rs ${text}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.date).isBefore(b.date) ? -1 : 1,
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
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
      title={'Expenses'}
      description={'Manage your expenses here.'}
      action={
        <Flex justify="end" align="middle" gap={12}>
          {/* Date Filter */}
          <Select
            style={{ width: 150 }}
            value={dateFilter}
            onChange={handleDateFilter}
            placeholder="Filter by date"
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="Today">Today</Select.Option>
            <Select.Option value="Week Ago">Week Ago</Select.Option>
            <Select.Option value="Month Ago">Month Ago</Select.Option>
            <Select.Option value="Year Ago">Year Ago</Select.Option>
          </Select>

          {/* Refresh Button */}
          <Button
            type="default"
            icon={<IoMdRefresh size={20} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          {/* Add Expense Button */}
          <Button
            type="primary"
            onClick={() => setIsOpen(true)}
            icon={<IoMdAdd />}
          >
            Add Expense
          </Button>
        </Flex>
      }
    >
      {/* CreateExpenseModal */}
      {isOpen && (
        <CreateExpenseModal isOpen={isOpen} handleClose={() => setIsOpen(false)} />
      )}

      {/* Automated Savings Suggestions - Displaying as Numeric Cards */}
      <Flex direction="row" justify="space-between" gap={16} style={{ marginBottom: '20px' }}>
        <Card bordered={false} style={{ width: 240, textAlign: 'center' }}>
          <Statistic
            title="Total Spending"
            value={savingsData.totalSpending}
            prefix="USD"
            valueStyle={{ color: '#cf1322' }} // Red for spending
          />
        </Card>

        <Card bordered={false} style={{ width: 240, textAlign: 'center' }}>
          <Statistic
            title="Total Budget"
            value={savingsData.totalBudget}
            prefix="USD"
            valueStyle={{ color: '#3f8600' }} // Green for budget
          />
        </Card>

        <Card bordered={false} style={{ width: 240, textAlign: 'center' }}>
          <Statistic
            title="Overspent Categories"
            value={savingsData.overspentCategories.length || 0} // Ensure it's a number
            valueStyle={{ color: '#cf1322' }} // Red for overspent
          />
        </Card>

        <Card bordered={false} style={{ width: 240, textAlign: 'center' }}>
          <Statistic
            title="Potential Savings"
            value={savingsData.potentialSavings.reduce((total, item) => total + item.savings, 0) || 0} // Ensure total is a number
            prefix="USD"
            valueStyle={{ color: '#52c41a' }} // Green for savings
          />
        </Card>

        {/* Remaining Budget Card */}
        <Card bordered={false} style={{ width: 240, textAlign: 'center' }}>
          <Statistic
            title="Remaining Budget"
            value={savingsData.totalBudget - savingsData.totalSpending}
            prefix="USD"
            valueStyle={{ color: '#1890ff' }} // Blue for remaining budget
          />
        </Card>
      </Flex>

      {/* Display Expenses in a Table */}
      <Table
        dataSource={filteredExpenses}
        columns={columns}
        rowKey={(record) => record.date + record.category} // Unique key for each row
        pagination={false}
        style={{ marginTop: '20px' }}
      />
    </PageWrapper>
  );
};

export default Expenses;
