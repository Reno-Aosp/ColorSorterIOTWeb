export default function ColorSummary({ stats }){
return (
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
{stats?.map((s) => (
<div key={s.colorName} className="p-4 bg-white rounded-2xl shadow">
<div className="text-sm text-gray-500">{s.colorName}</div>
<div className="text-2xl font-semibold">{s.count}</div>
</div>
))}
</div>
);
}