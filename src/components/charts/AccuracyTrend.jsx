import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2d] border border-[#2e3245] p-3 rounded-lg shadow-lg">
        <p className="text-white font-medium mb-1">Reviews: {label}</p>
        <p className="text-[#a29bfe] font-bold">Accuracy: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

function buildAccuracyTrendData(sessionLogs = []) {
  let data = [];
  if (sessionLogs.length > 0) {
    if (sessionLogs.length < 5) {
      data = sessionLogs.map((log, i) => ({
        review: `${i + 1}`,
        accuracy: log.correct ? 100 : 0
      }));
    } else {
      const recentLogs = sessionLogs.slice(-30);
      const windowSize = 5;
      for (let i = 0; i < recentLogs.length; i += windowSize) {
        const windowLogs = recentLogs.slice(i, i + windowSize);
        const correctCount = windowLogs.filter(log => log.correct).length;
        const accuracy = Math.round((correctCount / windowLogs.length) * 100);
        data.push({
          review: `${i + 1}-${i + windowLogs.length}`,
          accuracy
        });
      }
    }
  }
  return data;
}

const AccuracyTrend = ({ sessionLogs = [], streak = 0 }) => {
  const data = buildAccuracyTrendData(sessionLogs);
  const chartSummary = data.length === 0
    ? 'No review accuracy data yet.'
    : `Accuracy by review block, from ${data[0].accuracy}% to ${data[data.length - 1].accuracy}%, on a scale from 0% to 100%.`;

  return (
    <div className="bg-[#161623] bg-opacity-60 backdrop-blur-md border border-[#2e3245] rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 z-10 relative">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📈</span> Accuracy Trend
        </h3>
        <div className="bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] p-[1px] rounded-xl">
          <div className="bg-[#1e1e2d] px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-2xl font-black text-white">{streak}</span>
            <span className="text-sm text-gray-400 font-medium">Streak</span>
            {streak > 3 && <span className="text-xl">🔥</span>}
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[250px] z-10 relative" role="img" aria-label={chartSummary}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 8, bottom: 28 }}>
            <defs>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e3245" vertical={false} />
            <XAxis dataKey="review" stroke="#8b8da3" tick={{ fill: '#8b8da3' }} tickMargin={10}>
              <Label value="Review number or 5-review block" offset={-2} position="insideBottom" fill="#8b8da3" />
            </XAxis>
            <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} stroke="#8b8da3" tick={{ fill: '#8b8da3' }}>
              <Label value="Accuracy (%)" angle={-90} position="insideLeft" fill="#8b8da3" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4a4e69', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="linear" dataKey="accuracy" stroke="#a29bfe" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccuracyTrend;
