import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { simulateComparison } from '../../engine/adaptive.js';

const ComparisonChart = ({ concepts = [] }) => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({
    adaptiveTarget: null,
    randomTarget: null,
    diffPercent: 0,
    informative: false,
  });

  useEffect(() => {
    if (concepts && concepts.length > 0) {
      try {
        const results = simulateComparison(concepts);
        const informative = Boolean(results.informative);
        
        let adaptCross = 0;
        let randCross = 0;
        
        const chartData = results.targeted.map((val, idx) => {
          const adaptPct = Math.round(val * 100);
          const randPct = Math.round(results.random[idx] * 100);
          
          if (!adaptCross && adaptPct >= 80) adaptCross = idx + 1;
          if (!randCross && randPct >= 80) randCross = idx + 1;
          
          return {
            review: idx + 1,
            targeted: adaptPct,
            random: randPct
          };
        });
        
        setData(chartData);
        
        const diff = adaptCross && randCross
          ? Math.round(((randCross - adaptCross) / randCross) * 100)
          : 0;
        
        setMetrics({
          adaptiveTarget: adaptCross || null,
          randomTarget: randCross || null,
          diffPercent: diff > 0 ? diff : 0,
          informative,
        });
      } catch (err) {
        console.error("Simulation error", err);
      }
    } else {
      setData([]);
      setMetrics({ adaptiveTarget: null, randomTarget: null, diffPercent: 0, informative: false });
    }
  }, [concepts]);

  const chartSummary = data.length === 0
    ? 'No mastery projection data.'
    : `Toy simulation over ${data.length} reviews. Weak-first ends at ${data[data.length - 1].targeted}% average mastery and random order ends at ${data[data.length - 1].random}%.`;

  return (
    <div className="bg-[#1a1a2e] bg-opacity-80 backdrop-blur-xl border border-[#55efc4] border-opacity-30 rounded-2xl p-6 shadow-[0_0_30px_rgba(85,239,196,0.1)] relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#55efc4] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
        <span>⚡</span> Why Adaptive Review Matters
      </h3>
      <p className="text-[#a29bfe] text-sm mb-6">Simulated mastery projection based on your current knowledge state</p>
      
      <div className="flex-1 w-full min-h-[300px] mb-8" role="img" aria-label={chartSummary}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid stroke="#2e3245" strokeDasharray="3 3" />
            <XAxis dataKey="review" stroke="#8b8da3" tick={{ fill: '#8b8da3' }}>
              <Label value="Number of Reviews" offset={-10} position="insideBottom" fill="#8b8da3" />
            </XAxis>
            <YAxis domain={[0, 100]} stroke="#8b8da3" tick={{ fill: '#8b8da3' }}>
              <Label value="Average Mastery %" angle={-90} position="insideLeft" fill="#8b8da3" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#2e3245', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
            
            <ReferenceLine y={80} stroke="#fdcb6e" strokeDasharray="3 3" label={{ position: 'top', value: 'Mastery threshold', fill: '#fdcb6e', fontSize: 12 }} />
            
            <Line 
              type="monotone" 
              name="Adaptive (weak-first)" 
              dataKey="targeted" 
              stroke="#55efc4" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: '#55efc4', stroke: '#1a1a2e', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              name="Random order" 
              dataKey="random" 
              stroke="#ff7675" 
              strokeWidth={3} 
              strokeDasharray="8 4" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#161623] rounded-xl p-5 border border-[#2e3245]">
        {metrics.informative && metrics.adaptiveTarget && !metrics.randomTarget ? (
          <>
            <h4 className="text-xl text-white font-bold mb-2">
              In this projection, weak-first review reaches 80% average mastery in about {metrics.adaptiveTarget} reviews; random order does not reach 80% within the 50-review horizon.
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              This is a toy simulation from your current mastery values, not a measured result from your sessions.
            </p>
          </>
        ) : metrics.informative && metrics.diffPercent > 0 ? (
          <>
            <h4 className="text-xl text-white font-bold mb-2">
              In this projection, weak-first review hits 80% average mastery in ~{metrics.adaptiveTarget} reviews vs ~{metrics.randomTarget} for random order ({metrics.diffPercent}% fewer reviews).
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              This is a toy simulation from your current mastery values, not a measured result from your sessions.
            </p>
          </>
        ) : (
          <>
            <h4 className="text-xl text-white font-bold mb-2">
              Not enough mastery spread to compare strategies yet.
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              Complete a few quizzes first. The chart only claims a speedup when some lessons are ahead of others and the simulated curves actually differ.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ComparisonChart;
