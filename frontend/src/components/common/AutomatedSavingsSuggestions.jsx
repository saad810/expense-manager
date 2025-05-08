import React from 'react';
import { Card, Col, Row, Typography, Progress, Divider } from 'antd';
import { PieChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageWrapper } from './layout';

const { Title, Text } = Typography;

const sampleData = [
  { category: 'Dining Out', spent: 250, budget: 200 },
  { category: 'Entertainment', spent: 300, budget: 250 },
  { category: 'Groceries', spent: 500, budget: 450 },
  { category: 'Transportation', spent: 150, budget: 100 },
  { category: 'Subscriptions', spent: 75, budget: 80 },
];

const calculateSavingsSuggestion = (spent, budget) => {
  if (spent > budget) {
    const overspend = spent - budget;
    return {
      suggestion: `You’ve overspent by £${overspend}. Try reducing your spending in this category.`,
      color: 'red',
      icon: <ArrowDownOutlined />,
    };
  } else {
    const potentialSavings = budget - spent;
    return {
      suggestion: `You can save an extra £${potentialSavings} in this category by cutting back.`,
      color: 'green',
      icon: <ArrowUpOutlined />,
    };
  }
};

const AutomatedSavingsSuggestions = () => {
  return (
    <div style={{ marginTop: '20px' }}>


      {/* <Title level={3} style={{ marginBottom: '20px' }}>Saving Suggestions</Title> */}


      <Row gutter={16}>
        {sampleData.map((data, index) => {
          const { suggestion, color, icon } = calculateSavingsSuggestion(data.spent, data.budget);
          return (
            <Col span={8} key={index}>
              <Card
                title={data.category}
                bordered={false}
                extra={<PieChartOutlined />}
                style={{ marginBottom: '20px' }}
              >
                <Text>Spent: £{data.spent}</Text><br />
                <Text>Budget: £{data.budget}</Text><br />
                <Divider />
                <Text strong style={{ color: color }}>
                  {icon} {suggestion}
                </Text>
                <Progress
                  percent={(data.spent / data.budget) * 100}
                  status={data.spent > data.budget ? 'exception' : 'success'}
                  showInfo={false}
                  strokeColor={color}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default AutomatedSavingsSuggestions;
