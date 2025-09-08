import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// Add the missing getColorHex function
const getColorHex = (colorName) => {
  const colorMap = {
    // Basic colors
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
    grey: '#808080',
    
    // Extended colors
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    lime: '#32CD32',
    navy: '#000080',
    maroon: '#800000',
    olive: '#808000',
    teal: '#008080',
    silver: '#C0C0C0',
    gold: '#FFD700',
    
    // Fancy colors
    turquoise: '#40E0D0',
    coral: '#FF7F50',
    salmon: '#FA8072',
    khaki: '#F0E68C',
    plum: '#DDA0DD',
    orchid: '#DA70D6',
    crimson: '#DC143C',
    indigo: '#4B0082',
    violet: '#EE82EE',
    azure: '#F0FFFF',
    
    // Shades
    lightblue: '#ADD8E6',
    darkblue: '#00008B',
    lightgreen: '#90EE90',
    darkgreen: '#006400',
    lightred: '#FFB6C1',
    darkred: '#8B0000',
    lightyellow: '#FFFFE0',
    darkyellow: '#B8860B',
    
    // Fun colors
    hotpink: '#FF69B4',
    deeppink: '#FF1493',
    skyblue: '#87CEEB',
    forestgreen: '#228B22',
    royalblue: '#4169E1',
    firebrick: '#B22222',
    chocolate: '#D2691E',
    sandybrown: '#F4A460',
    
    // Neon colors
    neongreen: '#39FF14',
    neonblue: '#1B03A3',
    neonpink: '#FF073A',
    neonyellow: '#CCFF00',
    neonorange: '#FF6600'
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