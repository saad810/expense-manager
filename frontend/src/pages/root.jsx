import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  List,
  Alert,
  Divider,
  Space,
  Statistic,
  Layout,
  Grid,
  Spin,
  message,
  Radio
} from "antd";
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
import AnalyticsApi from "../api/analytics";
import { useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff4d4f"];

const getSuggestions = (data) => {
  console.log("Data for suggestions:", data);
  return data?.expenses?.map((item) => {
    if (item.spent > item.budget) {
      return `You are overspending in ${item.category}. Reduce spending by £${item.spent - item.budget}.`;
    } else if (item.spent < item.budget * 0.6) {
      return `Excellent savings in ${item.category}. You're £${item.budget - item.spent} under budget.`;
    } else if (item.spent < item.budget) {
      return `You're doing well in ${item.category}. You're £${item.budget - item.spent} under budget.`;
    } else {
      return `You're exactly on budget in ${item.category}. Stay consistent.`;
    }
  });
};

const Dashboard = () => {
  const screens = useBreakpoint();
  const [spendingType, setSpendingType] = useState("expenses");
  const [spendingData, setSpendingData] = useState([]);

  const isSmall = !screens.md;

  const { isLoading: loadingSavingsData, data } = useQuery({
    queryKey: ['get-analytics-one'],
    queryFn: () => AnalyticsApi.getAnalyticsOne(),
    onError: () => message.error('Failed to load analytics'),
  });

  const { isLoading: loadingSpendingsData, data: analyticsData } = useQuery({
    queryKey: ['get-analytics-two'],
    queryFn: () => AnalyticsApi.getAnalyticsTwo(),
    onError: () => message.error('Failed to load analytics'),
    onSuccess: (data) => {
      console.log('Fetched spending data:', data);
    }
    // Filtering data based on spendingType

  });


  useEffect(() => {
    let filteredData = [];

    if (spendingType === "expenses") {
      filteredData = analyticsData?.expenses.map(item => ({
        category: item.category,
        spent: item.budget,
      }));
    } else if (spendingType === "incomes") {
      filteredData = analyticsData?.incomes.map(item => ({
        category: item.category,
        spent: item.income,  // Use 'income' here for the Pie chart
      }));
    }

    setSpendingData(filteredData);
  }, [analyticsData, spendingType]);


  const [suggestions, setSuggestions] = React.useState([]);

  useEffect(() => {
    if (spendingData) {
      const suggestions = getSuggestions(spendingData);
      setSuggestions(suggestions);
    }
  }, [spendingData]);

  if (loadingSavingsData || loadingSpendingsData) {
    return <Spin size="large" fullscreen={true} />;
  }


  return (
    <Layout style={{ padding: '1rem' }}>
      <Title level={2} style={{ marginBottom: 20, textAlign: "center" }}>
        💸 SmartSpend Finance Dashboard
      </Title>
      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless">
            <Statistic title="Total Budget" value={data?.analytics?.totalBudget} prefix="£" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless">
            <Statistic title="Total Spent" value={data?.analytics?.totalSpending} prefix="£" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless">
            <Statistic title="Remaining Budget" value={data?.analytics?.remainingBudget} prefix="£" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless">
            <Statistic title="Overspent Categories" value={data?.analytics?.overspentCategories?.length} valueStyle={{ color: '#d46b08' }} />
          </Card>
        </Col>
      </Row>

      <Divider />
      <Radio.Group
        value={spendingType}
        onChange={(e) => setSpendingType(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <Radio.Button value="expenses">Expenses</Radio.Button>
        <Radio.Button value="incomes">Incomes</Radio.Button>
      </Radio.Group>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title="Spending Overview">
            <div style={{ overflowX: isSmall ? 'auto' : 'visible' }}>
              <div style={{ width: isSmall ? '600px' : '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="spent" fill="#8884d8" name="Spent" />
                    <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card title="Spending Breakdown">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={spendingData}
                  dataKey="spent"  // This should match the property in your data
                  nameKey="category"  // This should match the property for category or name
                  cx="50%"  // Center of the Pie
                  cy="50%"  // Center of the Pie
                  outerRadius={isSmall ? 70 : 100}  // Dynamic radius for responsiveness
                  label
                >
                  {spendingData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => `${name}: £${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>


      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Suggestions & Warnings">
            <List
              dataSource={suggestions}
              renderItem={(item) => (
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
          <Card title="Category Summary">
            <Row gutter={[16, 16]}>
              {spendingData?.map((item, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card variant="outlined" hoverable>
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
