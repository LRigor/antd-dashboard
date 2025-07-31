'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Tabs, 
  Space,
  Typography,
  Divider,
  Row,
  Col,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  AudioOutlined,
  SettingOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values);
      message.success('Login successful!');
      
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'account',
      label: 'Account Login',
      children: (
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username: admin or user"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password: ant.design"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '16px' 
          }}>
            <Image src="/logo.svg" alt="logo" width={44} height={44} />
            <Title level={3} style={{ margin: 0 }}>Ant Design</Title>
          </div>
          <Text type="secondary">
            Ant Design is the most influential web design specification in Xihu district
          </Text>
        </div>

        {/* Login Form */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={items}
          centered
        />

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          color: '#8c8c8c',
          fontSize: '12px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <Space>
              <span>
                <AudioOutlined style={{ marginRight: '4px' }} />
                Ant Design Pro
              </span>
              <span>
                <SettingOutlined style={{ marginRight: '4px' }} />
                Ant Design
              </span>
            </Space>
          </div>
          <div>© Powered by Ant Design</div>
        </div>
      </div>
    </div>
  );
}
