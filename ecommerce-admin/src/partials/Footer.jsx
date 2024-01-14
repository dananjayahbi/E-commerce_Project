import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter style={{ textAlign: 'center', backgroundColor: '#f0f2f5', padding: '20px' }}>
      Ecommerce Dashboard ©2024<br />
      Created by <a href="https://www.codeloom.com" target="_blank" rel="noopener noreferrer">CodeloomTechnologies</a>
    </AntFooter>
  );
}

export default Footer;
