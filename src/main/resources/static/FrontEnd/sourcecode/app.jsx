import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiGet, sseUrl } from './api/client';
import useSSE from './hooks/useSSE';
import ColorSummary from './components/ColorSummary';
import PieChart from './components/PieChart';
import LatestTable from './components/LatestTable';
import './style.css';

const qc = new QueryClient();

function Dashboard(){
    const { data: stats, refetch: refetchStats } = useQuery({ 
        queryKey:['stats'], 
        queryFn:()=>apiGet('/api/stats/colors'), 
        refetchInterval:5000 
    });
    
    const { data: latest, refetch: refetchLatest } = useQuery({ 
        queryKey:['latest'], 
        queryFn:()=>apiGet('/api/events/latest'), 
        refetchInterval:5000 
    });

    // Clear all data function
    const clearAllData = async () => {
        if (confirm('🗑️ Are you sure you want to clear all color history?')) {
            try {
                const response = await fetch('http://localhost:1000/api/events/clear', {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    const result = await response.text();
                    alert('✅ ' + result);
                    refetchStats();
                    refetchLatest();
                } else {
                    alert('❌ Failed to clear data');
                }
            } catch (error) {
                alert('❌ Error: ' + error.message);
            }
        }
    };

    useSSE(import.meta.env.VITE_SSE_URL || sseUrl, () => {
        refetchStats();
        refetchLatest();
    });

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-4">
            {/* Header with Clear Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">🎨 Color Sorter Dashboard</h1>
                
                <div className="flex gap-3">
                    {/* Data Stats */}
                    <div className="text-sm text-gray-600 flex items-center">
                        📊 Total Colors: {stats?.reduce((sum, s) => sum + s.count, 0) || 0}
                    </div>
                    
                    {/* Clear Button */}
                    <button 
                        onClick={clearAllData}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        🗑️ Clear History
                    </button>
                </div>
            </div>
            
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