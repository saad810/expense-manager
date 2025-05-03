import React, { useState } from 'react';
import { PageWrapper } from '../components/common/layout';
import { useQuery } from '@tanstack/react-query';
import newsApi from '../api/news';
import { Card, Spin, Flex } from 'antd';
import './news.css';
import NewsCard from '../components/common/NewsCard';

const News = () => {
    const { isLoading, data } = useQuery({
        queryKey: ['get-news'],
        queryFn: newsApi.getNews,
        onError: () => message.error('Failed to load news'),
    });

    // console.log('Fetched news:', data);

    return (
        <PageWrapper
            title="News"
            description="Latest News"
        >
            {
                isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Flex direction="row" wrap gap={16}>
                        {data?.data?.results.map((article) => (
                            <NewsCard
                                image_url={article.image_url}
                                link={article.link}
                                key={article.article_id}
                                title={article.title}
                                date={article.pubDate}
                                publisher={article.source_name}
                                category={article.category[0]} // Assuming category is available as an array
                            />
                        ))}
                    </Flex>
                )
            }
        </PageWrapper>
    );
};

export default News;
