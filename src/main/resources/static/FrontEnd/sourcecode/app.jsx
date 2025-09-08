import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiGet, sseUrl } from './api/client'; // Import sseUrl
import useSSE from './hooks/useSSE';
import ColorSummary from './components/ColorSummary';
import PieChart from './components/PieChart';
import LatestTable from './components/LatestTable';
import './style.css';


const qc = new QueryClient();


function Dashboard(){
const { data: stats, refetch: refetchStats } = useQuery({ queryKey:['stats'], queryFn:()=>apiGet('/api/stats/colors'), refetchInterval:5000 });
const { data: latest, refetch: refetchLatest } = useQuery({ queryKey:['latest'], queryFn:()=>apiGet('/api/events/latest'), refetchInterval:5000 });


useSSE(import.meta.env.VITE_SSE_URL || sseUrl, () => {
// when a new event arrives, refresh stats & latest
refetchStats();
refetchLatest();
});


return (
<div className="max-w-6xl mx-auto p-4 space-y-4">
<h1 className="text-2xl font-bold">Color Sorter Dashboard</h1>
<ColorSummary stats={stats} />
<PieChart stats={stats} />
<LatestTable events={latest} />
</div>
);
}


export default function App(){
return (
<QueryClientProvider client={qc}>
<Dashboard />
</QueryClientProvider>
);
}