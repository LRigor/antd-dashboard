'use client';

import React from 'react';
import { Pie } from '@ant-design/charts';

const PieChart = ({ data, height = 300, width = '100%' }) => {
  const config = {
    data,
    angleField: 'value',
    colorField: 'name',
    height,
    width,
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
      style: {
        fontSize: 12,
        fill: '#fff',
        fontWeight: 'bold',
      },
    },
    legend: {
      position: 'bottom',
      itemHeight: 20,
      itemWidth: 12,
      marker: {
        symbol: 'square',
        radius: 2,
      },
      text: {
        style: {
          fontSize: 12,
          fill: '#666',
        },
      },
    },
    color: data.map(item => item.color || '#1890ff'),
    tooltip: {
      formatter: (datum) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((datum.value / total) * 100).toFixed(1);
        return {
          name: datum.name,
          value: `${datum.value.toLocaleString()} (${percentage}%)`,
        };
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return <Pie {...config} />;
};

export default PieChart; 