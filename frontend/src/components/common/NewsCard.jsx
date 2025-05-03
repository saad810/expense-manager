import React from 'react';
import { Card, Tag, Row, Col } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

const { Meta } = Card;

const NewsCard = ({ title, date, publisher, category, image_url, link }) => {
  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #f0f0f0',
    width: '100%', // Responsive width
    maxWidth: '550px', // Fixed max width
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', // To prevent overflow
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    lineHeight: '1.5',
    whiteSpace: 'normal', // Allow wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Truncate with ellipsis if it's too long
    display: 'block',
    maxHeight: '3.6em', // Limit height to 2 lines
  };

  const categoryStyle = {
    fontWeight: '600',
    fontSize: '14px',
    color: '#1890ff',
    backgroundColor: '#f0f9ff',
    padding: '5px 10px',
    borderRadius: '12px',
  };

  const metaStyle = {
    fontSize: '14px',
    color: '#888',
  };

  const descriptionStyle = {
    whiteSpace: 'normal',
  };

  return (
    <Card
      hoverable
      style={cardStyle}
      cover={
        image_url && (
          <img
            alt={title}
            src={image_url}
            style={{
              width: '100%', // Responsive width
              height: '200px', // Fixed height
              objectFit: 'cover', // To ensure the image scales properly
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          />
        )
      }
      title={<h3 style={titleStyle}>{title}</h3>}
      extra={<Tag color="blue" style={categoryStyle}>{category}</Tag>}
      onClick={() => window.open(link, '_blank')} // Open the link in a new tab when the card is clicked
    >
      <Row gutter={[16, 8]} justify="space-between">
        <Col>
          <Meta
            description={<span style={{ ...metaStyle, ...descriptionStyle }}><CalendarOutlined style={{ color: '#1890ff', marginRight: '6px' }} /> {new Date(date).toLocaleDateString()}</span>}
          />
        </Col>
        <Col>
          <Meta description={<span style={{ ...metaStyle, ...descriptionStyle }}><UserOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> {publisher}</span>} />
        </Col>
      </Row>
    </Card>
  );
};

export default NewsCard;
