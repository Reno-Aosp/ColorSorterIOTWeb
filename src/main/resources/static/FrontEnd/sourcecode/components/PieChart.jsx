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
return <div ref={ref} style={{height: 300}} className="bg-white rounded-2xl shadow"/>;
}