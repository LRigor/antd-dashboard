'use client';

import React from 'react';
import { Column } from '@ant-design/charts';

const BarChart = ({ data, height = 300, color = '#1890ff', width = '100%' }) => {
  const config = {
    data,
    xField: 'month',
    yField: 'sales',
    height,
    width,
    color,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    xAxis: {
      label: {
        style: {
          fontSize: 12,
          fill: '#666',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: 10,
          fill: '#999',
        },
        formatter: (value) => Math.round(value).toLocaleString(),
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
          },
        },
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.month,
          value: `${datum.sales?.toLocaleString() || datum.value?.toLocaleString() || 0}`,
        };
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return <Column {...config} />;
};

export default BarChart; 