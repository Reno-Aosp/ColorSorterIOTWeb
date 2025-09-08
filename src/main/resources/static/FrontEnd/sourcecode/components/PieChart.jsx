import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// Add the missing getColorHex function
const getColorHex = (colorName) => {
  const colorMap = {
    red: '#FF0000',
    blue: '#0000FF', 
    green: '#00FF00',
    yellow: '#FFFF00',
    purple: '#800080',
    orange: '#FFA500',
    pink: '#FFC0CB',
    brown: '#A52A2A',
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    grey: '#808080'
  };
  
  return colorMap[colorName?.toLowerCase()] || '#CCCCCC';
};

export default function PieChart({ stats }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Track chart instance

  useEffect(() => {
    console.log('PieChart stats data:', stats);
    
    if (chartRef.current && stats?.length > 0) {
      // Dispose existing chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }

      // Create new chart instance
      chartInstance.current = echarts.init(chartRef.current);
      
      const data = stats.map(stat => ({
        value: stat.count,
        name: stat.colorName,
        itemStyle: { 
          color: getColorHex(stat.colorName) 
        }
      }));
      
      console.log('Chart data:', data);
      
      const option = {
        title: {
          text: 'Color Distribution',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Colors',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      chartInstance.current.setOption(option);
      
      // Handle window resize
      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [stats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
}