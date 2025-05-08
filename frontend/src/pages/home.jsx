import React, { useRef } from 'react';
import { Layout, Button, Anchor, Space, Row, Col, Typography, Card, Steps, Avatar } from 'antd';
import {
    LoginOutlined,
    RocketOutlined,
    BankOutlined, // Logo placeholder
    AreaChartOutlined, // Hero visual placeholder
    PieChartOutlined, // Feature icon
    SyncOutlined, // Feature icon
    AimOutlined, // Feature icon
    BarChartOutlined, // Feature icon / Dashboard placeholder
    LinkOutlined, // How it works icon
    ScanOutlined, // How it works icon
    SolutionOutlined, // How it works icon
    DotChartOutlined, // Dashboard placeholder
    LockOutlined, // Security icon
    SafetyCertificateOutlined, // Security icon
    SecurityScanFilled, // Security icon
 } from '@ant-design/icons';
import "./home.css"

// --- Ant Design Components ---
const { Header: AntHeader, Content, Footer: AntFooter } = Layout;
const { Link: AnchorLink } = Anchor; // Renamed to avoid conflict with React Router Link if used later
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

// --- Header Component ---
const AppHeader = () => {
    return (
        <AntHeader className="app-header">
            <div className="header-container">
                {/* Logo */}
                <div className="logo">
                    <BankOutlined />
                    <span style={{ marginLeft: '10px', fontSize: '20px', fontWeight: 'bold' }}>Smart Spend</span>
                </div>

                <Space className="header-buttons">
                    <Button
                        icon={<LoginOutlined />}
                        onClick={() => window.location.href = '/login'}
                    >
                        Login
                    </Button>

                    <Button
                        type="primary"
                        icon={<RocketOutlined />}
                        onClick={() => window.location.href = '/signup'}
                    >
                        Get Started
                    </Button>
                </Space>

            </div>
        </AntHeader >
    );
};


// --- Hero Section ---
const HeroSection = () => (
    <div id="hero" className="section section-light hero-section">
        <Row align="middle" justify="space-around" gutter={[48, 48]} style={{ width: '100%' }}>
            <Col xs={24} md={10} style={{ textAlign: 'center' }}>
                <AreaChartOutlined style={{ fontSize: '250px', color: '#e6f7ff' }} />
            </Col>
            <Col xs={24} md={12} className="hero-content">
                <Title level={1} style={{ marginBottom: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>
                    Master Your Money, Visually.
                </Title>
                <Paragraph style={{ fontSize: '18px', color: '#555', marginBottom: '30px' }}>
                    Simple, intuitive, and powerful personal finance management.
                </Paragraph>
                <Button type="primary" size="large" icon={<RocketOutlined />} style={{ padding: '0 30px' }}>
                    Get Started Free
                </Button>
            </Col>
        </Row>
    </div>
);

// --- Features Section ---
const FeaturesSection = () => {
    const features = [
        { icon: <SyncOutlined />, title: 'Link Accounts', description: 'Securely connect banks.' },
        { icon: <PieChartOutlined />, title: 'Visualize Spending', description: 'See where money goes.' },
        { icon: <BarChartOutlined />, title: 'Smart Budgeting', description: 'Create & track easily.' },
        { icon: <AimOutlined />, title: 'Set Goals', description: 'Plan your future.' },
    ];

    return (
        <div id="features" className="section section-dark">
            <Title level={2} style={{ marginBottom: '60px' }}>Everything You Need</Title>
            <Row gutter={[32, 48]} justify="center" style={{ maxWidth: '1000px' }}>
                {features.map((feature, index) => (
                    <Col key={index} xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                        {/* Using simple divs for minimalism */}
                        <div style={{ padding: '20px 0' }}>
                            <span style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px', display: 'block' }}>
                                {feature.icon}
                            </span>
                            <Title level={4} style={{ marginBottom: '8px' }}>{feature.title}</Title>
                            <Paragraph type="secondary">{feature.description}</Paragraph>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

// --- How It Works Section ---
const HowItWorksSection = () => (
    <div id="how-it-works" className="section section-light">
        <Title level={2} style={{ marginBottom: '60px' }}>Get Started in Minutes</Title>
        <Row justify="center" style={{ width: '100%', maxWidth: '900px' }}>
            <Col span={24}>
                {/* Use horizontal steps on larger screens, vertical on smaller */}
                <Steps
                    current={3} // Show all as completed/illustrative
                    responsive={true} // Switches layout based on screen size
                    labelPlacement="vertical" // Default to vertical labels
                    className="how-it-works-steps"
                >
                    <Step
                        title="Link"
                        description="Connect accounts securely."
                        icon={<LinkOutlined />}
                    />
                    <Step
                        title="Track"
                        description="Visualize spending automatically."
                        icon={<ScanOutlined />}
                    />
                    <Step
                        title="Achieve"
                        description="Budget, set goals, gain insights."
                        icon={<SolutionOutlined />}
                    />
                </Steps>
            </Col>
        </Row>
        {/* Optional: Add a relevant abstract shape or minimal graphic below the steps */}
        <div className="divider-shape"></div>
    </div>
);

// --- Dashboard Preview Section ---
const DashboardPreviewSection = () => (
    <div id="dashboard" className="section section-dark">
        <Title level={2} style={{ marginBottom: '20px' }}>Your Financial Command Center</Title>
        <Paragraph type="secondary" style={{ marginBottom: '50px', maxWidth: '600px', textAlign: 'center' }}>
            A clear, visual snapshot of your finances. Track progress, identify trends, and make informed decisions.
        </Paragraph>
        <Row justify="center" align="middle" style={{ width: '100%', maxWidth: '900px' }}>
            <Col span={24} style={{ textAlign: 'center', background: '#fff', padding: '40px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                {/* Placeholder for Dashboard Image/Mockup - using icons */}
                <Title level={4} style={{ color: '#aaa', marginBottom: '30px' }}>Dashboard Preview</Title>
                <Row gutter={[16, 16]} justify="center" align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <BarChartOutlined style={{ fontSize: '100px', color: '#d9d9d9' }} />
                        <Paragraph style={{ color: '#aaa' }}>Spending Overview</Paragraph>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <PieChartOutlined style={{ fontSize: '100px', color: '#d9d9d9' }} />
                        <Paragraph style={{ color: '#aaa' }}>Budget Tracking</Paragraph>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <DotChartOutlined style={{ fontSize: '100px', color: '#d9d9d9' }} />
                        <Paragraph style={{ color: '#aaa' }}>Investment Growth</Paragraph>
                    </Col>
                </Row>
                {/* Replace above Row with: <img src="/path/to/dashboard-mockup.png" alt="Dashboard Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} /> */}
            </Col>
        </Row>
    </div>
);

// --- Security Section ---
const SecuritySection = () => (
    <div id="security" className="section section-light">
        <Title level={2} style={{ marginBottom: '60px' }}>Your Security is Our Priority</Title>
        <Row gutter={[48, 48]} justify="center" style={{ maxWidth: '1000px' }}>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <Avatar size={72} icon={<LockOutlined />} className="security-icon" />
                <Title level={4} style={{ marginTop: '15px', marginBottom: '8px' }}>Bank-Level Encryption</Title>
                <Paragraph type="secondary">AES-256 encryption protects your sensitive data.</Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <Avatar size={72} icon={<SecurityScanFilled />} className="security-icon" />
                <Title level={4} style={{ marginTop: '15px', marginBottom: '8px' }}>Data Privacy</Title>
                <Paragraph type="secondary">We never sell your personal information. Ever.</Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <Avatar size={72} icon={<SafetyCertificateOutlined />} className="security-icon" />
                <Title level={4} style={{ marginTop: '15px', marginBottom: '8px' }}>Secure Connections</Title>
                <Paragraph type="secondary">Read-only access ensures your money stays safe.</Paragraph>
            </Col>
        </Row>
    </div>
);

// --- Call To Action Section ---
const CallToActionSection = () => (
    <div id="cta" className="section section-dark cta-section">
        {/* Optional: Add a large background shape/gradient here */}
        <div className="cta-content">
            <Title level={2} style={{ marginBottom: '20px', color: '#333' }}>
                Ready to Take Control?
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#555', marginBottom: '30px', maxWidth: '500px', textAlign: 'center' }}>
                Start managing your finances the smart way. It's free to get started.
            </Paragraph>
            <Button type="primary" size="large" icon={<RocketOutlined />} style={{ padding: '0 30px' }}>
                Sign Up Free Now
            </Button>
        </div>
    </div>
);

// --- Footer Component ---
const AppFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <AntFooter className="app-footer">
            <Space direction="vertical" size="middle" style={{ width: '100%', alignItems: 'center' }}>
                <Text type="secondary">
                    © {currentYear} FinManage. All Rights Reserved.
                </Text>
            </Space>
        </AntFooter>
    );
};


// --- Main App Component ---
function Home() {
    return (
        <Layout style={{ minHeight: '100vh', overflowX: 'hidden' }}> {/* Prevent horizontal scroll */}
            <AppHeader />
            <Content className="main-content">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <DashboardPreviewSection />
                <SecuritySection />
                <CallToActionSection />
            </Content>
            <AppFooter />
        </Layout>
    );
}

export default Home;

