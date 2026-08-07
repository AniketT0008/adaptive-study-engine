import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SM2Sandbox() {
  const [initialEasiness, setInitialEasiness] = useState(2.5);
  const [qualityPattern, setQualityPattern] = useState([5, 5, 4, 5, 4]); // 5 consecutive reviews quality

  // Calculate 10 future review intervals based on SM-2 formula
  const calculateCurve = () => {
    let ef = parseFloat(initialEasiness);
    let interval = 1;
    let repetitions = 0;
    const curve = [];

    let totalDays = 0;

    for (let i = 0; i < 8; i++) {
      const q = qualityPattern[i % qualityPattern.length];
      
      // Update EF
      ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (ef < 1.3) ef = 1.3;

      if (q < 3) {
        repetitions = 0;
        interval = 1;
      } else {
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 6;
        else interval = Math.round(interval * ef);
        repetitions += 1;
      }

      totalDays += interval;

      curve.push({
        review: `#${i + 1}`,
        intervalDays: interval,
        cumulativeDays: totalDays,
        easeFactor: parseFloat(ef.toFixed(2)),
        quality: q
      });
    }

    return curve;
  };

  const data = calculateCurve();

  return (
    <div className="glass-strong p-6 rounded-2xl border border-white/[0.08] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <span>🔬</span> SM-2 Algorithm Interactive Simulator
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            See how the SuperMemo-2 mathematical formula expands review intervals exponentially over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--color-text-muted)] font-medium">Initial Ease Factor:</label>
          <input
            type="range"
            min="1.3"
            max="3.0"
            step="0.1"
            value={initialEasiness}
            onChange={(e) => setInitialEasiness(parseFloat(e.target.value))}
            className="w-24 accent-[var(--color-accent)] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[var(--color-accent-light)] bg-white/[0.06] px-2 py-1 rounded">
            {initialEasiness}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3245" />
              <XAxis dataKey="review" stroke="#8b8da3" tick={{ fill: '#8b8da3' }} />
              <YAxis stroke="#8b8da3" tick={{ fill: '#8b8da3' }} label={{ value: 'Days to Next Review', angle: -90, position: 'insideLeft', fill: '#8b8da3', style: { fontSize: 12 } }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2330', borderColor: '#2e3245', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Line type="monotone" name="Interval (Days)" dataKey="intervalDays" stroke="#00cec9" strokeWidth={3} dot={{ r: 4, fill: '#00cec9' }} />
              <Line type="monotone" name="Cumulative Days" dataKey="cumulativeDays" stroke="#a29bfe" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown table */}
        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
          <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Review Projections</h4>
          {data.map((item, idx) => (
            <div key={idx} className="glass p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--color-text)] font-bold">{item.review}</span>
              <span className="text-[var(--color-text-muted)]">q={item.quality}</span>
              <span className="text-[var(--color-success)] font-semibold">+{item.intervalDays}d next</span>
              <span className="text-[var(--color-accent-light)]">EF: {item.easeFactor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
