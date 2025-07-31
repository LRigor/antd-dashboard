'use client';

import React from 'react';
import { Line } from '@ant-design/charts';

const LineChart = ({ data, height = 300, color = '#1890ff', width = '100%' }) => {
  const config = {
    data,
    xField: 'month',
    yField: 'sales',
    height,
    width,
    color,
    smooth: true,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: color,
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    line: {
      style: {
        stroke: color,
        lineWidth: 2,
      },
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

  return <Line {...config} />;
};

export default LineChart; 