import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Descriptions, Space, Table, Tag, Tabs, message, Row, Col } from 'antd';
import type { TabsProps } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { AssetResponseScheme, Status } from '../../models/asset';
import useAssetService from '../../services/api/assets';
import useAssetLogsService from '../../services/api/asset_logs';
import { AssetLogResponseScheme } from '../../models/asset_logs';
import dayjs from 'dayjs';

const AssetDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAsset } = useAssetService();
  const { getAssetLogs } = useAssetLogsService();
  const [asset, setAsset] = useState<AssetResponseScheme | null>(null);
  const [assetLogs, setAssetLogs] = useState<AssetLogResponseScheme[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchAssetData = async () => {
    try {
      const response = await getAsset(Number(id));
      setAsset(response.data);
    } catch (error) {
      message.error('Failed to fetch asset data');
    }
  };

  const fetchAssetLogs = async () => {
    if (!id) return;
    
    try {
      setLogsLoading(true);
      const response = await getAssetLogs(Number(id));
      setAssetLogs(response.data)
    } catch (error) {
      message.error('Failed to fetch asset logs');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetData();
    fetchAssetLogs();
  }, [id]);

  const renderStatus = (status: Status | undefined) => {
    if (!status) return null;
    const statusKey = Object.entries(Status).find(([_, value]) => value === status)?.[0] || status;
    return <Tag>{statusKey}</Tag>;
  };

  const logColumns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
      align: 'center' as const,
    },
    {
      title: 'Action',
      dataIndex: 'event_type',
      key: 'event_type',
      align: 'center' as const,
    },
    {
      title: 'Actor',
      dataIndex: ['user', 'email'],
      key: 'actor',
      align: 'center' as const,
    },
    {
      title: 'Changes',
      dataIndex: 'updated_values',
      key: 'updated_values',
      align: 'center' as const,
      render: (updated_values: Record<string, { old_value: any, new_value: any }>) => {
        if (!updated_values) return null;
        
        const formatValue = (value: any) => {
          if (!value) return 'none';
          
          const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)?$/;
          if (datePattern.test(value)) {
            return new Date(value).toLocaleDateString();
          }
          
          return value;
        };
        
        return (
            Object.entries(updated_values).map(([key, values]) => (
              <div key={key} style={{ marginBottom: 8 }}>
                <strong>{key}:</strong><br />
                <span style={{ color: '#ff4d4f' }}>{formatValue(values.old_value)}</span>
                {' → '}
                <span style={{ color: '#52c41a' }}>{formatValue(values.new_value)}</span>
              </div>
            ))
        );
      },
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Info',
      children: (
        <Descriptions 
          bordered 
          column={1} 
          labelStyle={{ width: '20vw' }}
          size="middle"
        >
          <Descriptions.Item label="Name">
            {asset?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Serial Number">
            {asset?.serial_number}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {renderStatus(asset?.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Model">
            {asset?.model?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Supplier">
            {asset?.supplier?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {asset?.location?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Company">
            {asset?.company?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Purchase Date">
            {asset?.purchase_date ? dayjs(asset.purchase_date).format('YYYY-MM-DD') : 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="Purchase Cost">
            {asset?.purchase_cost || 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="Invoice Number">
            {asset?.invoice_number || 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="Warranty Expiration">
            {asset?.varrianty_expiration_date ? 
              dayjs(asset.varrianty_expiration_date).format('YYYY-MM-DD') : 
              'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="Notes">
            {asset?.notes || 'No notes'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: 'History',
      children: (
        <Table 
          scroll={{ y: 'calc(100vh - 319px)', x: 1000 }}
          size="small"
          loading={logsLoading}
          dataSource={assetLogs} 
          columns={logColumns} 
          rowKey="id"
          pagination={false}
        />
      ),
    },
  ];

  return (
    <Card
      style={{ height: 'calc(100%)' }}
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/assets')}
              />
              <span>Asset Details</span>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/assets/${id}/edit`)}
              >
                Edit
              </Button>
            </Space>
          </Col>
        </Row>
      }
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Card>
  );
};

export default AssetDetails;
