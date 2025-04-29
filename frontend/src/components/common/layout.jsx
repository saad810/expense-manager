
import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';

const { Title, Text } = Typography;
const { Content } = Layout;

export const PageWrapper = ({ title, description, children, action }) => {
    return (
        <Layout style={{ padding: '1px 0' }}>
            <Content style={{ margin: '0 auto', width: '100%' }}>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    <SectionTitle title={title} description={description} action={action} />
                    {children}
                </Space>
            </Content>
        </Layout>
    );
};


export const SectionTitle = ({ title, description, action }) => {
    return (
        <Row justify="space-between" align="middle" wrap={false}>
            <Col flex="auto">
                <Space direction="vertical" size={4}>
                    <Title level={2} style={{ color: '#011638', margin: 0 }}>
                        {title}
                    </Title>
                    {description && <Text>{description}</Text>}
                </Space>
            </Col>
            {action && (
                <Col>
                    {action}
                </Col>
            )}
        </Row>
    );
};


