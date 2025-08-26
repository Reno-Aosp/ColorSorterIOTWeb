export default function LatestTable({ events }){
return (
<div className="bg-white rounded-2xl shadow overflow-hidden">
<table className="min-w-full text-sm">
<thead className="bg-gray-100">
<tr>
<th className="px-3 py-2 text-left">Time</th>
<th className="px-3 py-2 text-left">Device</th>
<th className="px-3 py-2 text-left">Color</th>
<th className="px-3 py-2 text-left">RGB</th>
<th className="px-3 py-2 text-left">Bin</th>
<th className="px-3 py-2 text-left">Conf.</th>
</tr>
</thead>
<tbody>
{(events||[]).map(e => (
<tr key={e.id} className="border-t">
<td className="px-3 py-2">{new Date(e.ts).toLocaleString()}</td>
<td className="px-3 py-2">{e.deviceId}</td>
<td className="px-3 py-2 font-medium">{e.colorName}</td>
<td className="px-3 py-2">{e.r},{e.g},{e.b}</td>
<td className="px-3 py-2">{e.binId||'-'}</td>
<td className="px-3 py-2">{e.confidence?.toFixed(2)}</td>
</tr>
))}
</tbody>
</table>
</div>
);
}