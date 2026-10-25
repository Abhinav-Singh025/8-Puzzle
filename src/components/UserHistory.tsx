import React from 'react';

interface UserHistoryProps {
  sessions: any[];
  onReplay: (session: any) => void;
}

const UserHistory: React.FC<UserHistoryProps> = ({ sessions, onReplay }) => {
  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center text-white/40 italic">
        You haven't solved any puzzles yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Algorithm</th>
            <th className="py-4 px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Moves</th>
            <th className="py-4 px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Time</th>
            <th className="py-4 px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Date</th>
            <th className="py-4 px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, i) => (
            <tr key={session.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
              <td className="py-4 px-4">
                <p className="text-sm font-bold text-white">{session.algorithm}</p>
                <p className="text-[10px] text-white/40">{session.gridSize}</p>
              </td>
              <td className="py-4 px-4 text-sm font-mono text-purple-400">{session.moves}</td>
              <td className="py-4 px-4 text-sm font-mono text-blue-400">{session.time.toFixed(2)}s</td>
              <td className="py-4 px-4 text-[10px] text-white/40">
                {new Date(session.solvedAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <button 
                  onClick={() => onReplay(session)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
                >
                  Replay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserHistory;
