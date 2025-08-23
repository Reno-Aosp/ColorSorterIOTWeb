import { useEffect } from 'react';


export default function useSSE(url, onEvent){
useEffect(() => {
const es = new EventSource(url);
es.addEventListener('event', (e) => {
try { onEvent(JSON.parse(e.data)); } catch {}
});
return () => es.close();
}, [url, onEvent]);
}