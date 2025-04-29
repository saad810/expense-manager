import React from "react";
import { Card, Col, Row, Typography, List, Alert, Divider, Space, Statistic, Layout } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const { Title, Text } = Typography;

const spendingData = [
  { category: "Groceries", spent: 250, budget: 200 },
  { category: "Entertainment", spent: 80, budget: 100 },
  { category: "Rent", spent: 1000, budget: 1000 },
  { category: "Transport", spent: 120, budget: 150 },
  { category: "Utilities", spent: 180, budget: 200 },
  { category: "Subscriptions", spent: 90, budget: 50 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff4d4f"];

const getSuggestions = (data) => {
  return data.map((item) => {
    if (item.spent > item.budget) {
      return `You are overspending in ${item.category}. Reduce spending by $${item.spent - item.budget}.`;
    } else if (item.spent < item.budget * 0.6) {
      return `Excellent savings in ${item.category}. You're $${item.budget - item.spent} under budget.`;
    } else if (item.spent < item.budget) {
      return `You're doing well in ${item.category}. You're $${item.budget - item.spent} under budget.`;
    } else {
      return `You're exactly on budget in ${item.category}. Stay consistent.`;
    }
  });
};

const Dashboard = () => {
  const suggestions = getSuggestions(spendingData);
  const totalSpent = spendingData.reduce((sum, item) => sum + item.spent, 0);
  const totalBudget = spendingData.reduce((sum, item) => sum + item.budget, 0);
  const overBudgetCategories = spendingData.filter((item) => item.spent > item.budget);

  return (
    <Layout >
      <Title level={2} style={{ marginBottom: 20 }}>💸 SmartSpend Finance Dashboard</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ backgroundColor: '#ffffff' }}>
            <Statistic title="Total Budget" value={totalBudget} prefix="$" />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ backgroundColor: '#ffffff' }}>
            <Statistic title="Total Spent" value={totalSpent} prefix="$" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ backgroundColor: '#ffffff' }}>
            <Statistic title="Remaining Budget" value={totalBudget - totalSpent} prefix="$" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ backgroundColor: '#ffffff' }}>
            <Statistic title="Overspent Categories" value={overBudgetCategories.length} valueStyle={{ color: '#d46b08' }} />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Spending Overview">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={spendingData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="spent" fill="#8884d8" name="Spent" />
                <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Spending Breakdown">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={spendingData}
                  dataKey="spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Suggestions & Warnings" bordered={false}>
            <List
              dataSource={suggestions}
              renderItem={(item, index) => (
                <List.Item>
                  <Alert
                    message={item}
                    type={item.includes("overspending") ? "error" : "success"}
                    showIcon
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Category Summary" bordered={false}>
            <Row gutter={[16, 16]}>
              {spendingData.map((item, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card bordered={true} hoverable style={{ backgroundColor: '#fafafa' }}>
                    <Space direction="vertical">
                      <Text strong>{item.category}</Text>
                      <Text>Spent: ${item.spent}</Text>
                      <Text>Budget: ${item.budget}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;