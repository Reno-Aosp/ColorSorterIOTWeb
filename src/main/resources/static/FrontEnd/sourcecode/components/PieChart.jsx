import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';


export default function PieChart({ stats }){
const ref = useRef(null);
useEffect(() => {
if(!ref.current) return;
const chart = echarts.init(ref.current);
const data = (stats||[]).map(s => ({ name: s.colorName, value: s.count }));
chart.setOption({
tooltip: { trigger: 'item' },
series: [{ type: 'pie', radius: '65%', data }]
});
const resize = () => chart.resize();
window.addEventListener('resize', resize);
return () => { window.removeEventListener('resize', resize); chart.dispose(); };
}, [stats]);
useEffect(() => {
if (ref.current && stats?.length > 0) {
setTimeout(() => {
const chart = echarts.init(ref.current);
chart.setOption({
tooltip: { trigger: 'item' },
series: [{ type: 'pie', radius: '65%', data }]
});

const handleResize = () => chart.resize();
window.addEventListener('resize', handleResize);

return () => {
window.removeEventListener('resize', handleResize);
chart.dispose();
};
}, 100);
}
}, [stats]);
useEffect(() => {
  console.log('PieChart stats data:', stats); // Add this debug line
  
  if (ref.current && stats?.length > 0) {
    const chart = echarts.init(ref.current);
    
    const data = stats.map(stat => ({
      value: stat.count,
      name: stat.colorName,
      itemStyle: { color: getColorHex(stat.colorName) }
    }));
    
    console.log('Chart data:', data); // Add this debug line too
    
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: '65%', data }]
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }
}, [stats]);
return <div ref={ref} style={{height: 300}} className="bg-white rounded-2xl shadow"/>;
}