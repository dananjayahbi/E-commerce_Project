import React from 'react';
import { Layout, Card, Row, Col, Statistic } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Content, Footer } = Layout;

const Home = () => {
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-content" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic title="Active Users" value={112} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="New Users" value={32} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Sales" value={93} />
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card title="Line Chart">
                  <Line data={lineData} />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
