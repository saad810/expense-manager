import React from 'react';
import { Layout, Row, Col, Typography, Space, Grid } from 'antd';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

export const PageWrapper = ({ title, description, children, action }) => {
    return (
        <Layout style={{ padding: '1px 0' }}>
            <Content style={{ margin: '0 auto', width: '100%', padding: '1rem' }}>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    <SectionTitle title={title} description={description} action={action} />
                    {children}
                </Space>
            </Content>
        </Layout>
    );
};

export const SectionTitle = ({ title, description, action }) => {
    const screens = useBreakpoint();

    return (
        <Row
            justify="space-between"
            align={screens.xs ? 'start' : 'middle'}
            wrap
            gutter={[12, 12]}
        >
            <Col flex="auto">
                <Space direction="vertical" size={4}>
                    <Title level={screens.xs ? 4 : 2} style={{ color: '#011638', margin: 0 }}>
                        {title}
                    </Title>
                    {description && <Text>{description}</Text>}
                </Space>
            </Col>
            {action && (
                <Col xs={24} sm="auto">
                    <div style={{ display: 'flex', justifyContent: screens.xs ? 'flex-start' : 'flex-end' }}>
                        {action}
                    </div>
                </Col>
            )}
        </Row>
    );
};
