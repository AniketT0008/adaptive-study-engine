import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2d] border border-[#2e3245] p-3 rounded-lg shadow-lg">
        <p className="text-white font-medium">{payload[0].payload.name}</p>
        <p className="text-gray-300">Mastery: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const MasteryChart = ({ concepts = [] }) => {
  const ranked = [...concepts]
    .map((concept) => ({
      name: concept.label,
      mastery: Math.round((concept.mastery || 0) * 100),
      practiced: (concept.history?.length || 0) > 0,
    }))
    .sort((a, b) => {
      if (a.practiced !== b.practiced) return a.practiced ? -1 : 1;
      return a.mastery - b.mastery;
    });
  const data = ranked.slice(0, 12);
  const hiddenCount = Math.max(0, concepts.length - data.length);

  const getColor = (value) => {
    if (value < 30) return '#ff7675';
    if (value <= 50) return '#fdcb6e';
    if (value <= 70) return '#ffeaa7';
    return '#55efc4';
  };

  const chartHeight = Math.max(data.length * 48 + 40, 240);

  return (
    <div className="bg-[#161623] bg-opacity-60 backdrop-blur-md border border-[#2e3245] rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span>🧠</span> Lowest mastery
      </h3>
      <p className="text-xs text-[#8b8da3] mb-4">
        Showing up to 12 lessons that need the most work{hiddenCount > 0 ? ` (${hiddenCount} more not plotted)` : ''}.
      </p>
      <div className="flex-1 w-full" style={{ minHeight: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e3245" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val}%`} stroke="#8b8da3" />
            <YAxis dataKey="name" type="category" width={140} stroke="#8b8da3" tick={{ fill: '#8b8da3' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2e3245', opacity: 0.4 }} />
            <Bar dataKey="mastery" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.mastery)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MasteryChart;
