import React from 'react';

export default function RecallHistory({ sessionLogs, concepts }) {
  if (!sessionLogs || sessionLogs.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl text-center">
        <p className="text-[var(--color-text-muted)]">No review history yet. Start a study session!</p>
      </div>
    );
  }

  // Group by date
  const groupedLogs = sessionLogs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="glass-strong p-6 rounded-2xl max-h-96 overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Review History</h3>
      {Object.keys(groupedLogs).map((date) => (
        <div key={date} className="mb-6 last:mb-0">
          <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            {date}
          </h4>
          <div className="space-y-3">
            {groupedLogs[date].map((log, idx) => {
              const concept = concepts?.find((c) => c.id === log.conceptId);
              return (
                <div key={idx} className="glass p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--color-text-muted)] w-12">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-medium text-[var(--color-text)]">
                      {concept?.label || 'Unknown Concept'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${
                      log.difficulty === 'easy' ? 'badge-easy' :
                      log.difficulty === 'hard' ? 'badge-hard' : 'badge-medium'
                    }`}>
                      {log.difficulty || 'medium'}
                    </span>
                    <span className="text-lg">
                      {log.correct ? (
                        <span className="text-[var(--color-success)] font-bold">✓</span>
                      ) : (
                        <span className="text-[var(--color-danger)] font-bold">✗</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
