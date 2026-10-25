import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { LeaderboardEntry } from '../../types';

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[];
      setEntries(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8">
      <h2 className="text-3xl font-black text-white mb-8 tracking-tighter">Global Leaderboard</h2>
      <div className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-white/40 text-center py-10">No entries yet. Be the first!</p>
        ) : (
          entries.map((entry, index) => (
            <div 
              key={entry.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-black ${index < 3 ? 'text-yellow-400' : 'text-white/20'}`}>
                  #{index + 1}
                </span>
                <div>
                  <p className="font-bold text-white">{entry.username}</p>
                  <p className="text-xs text-white/40">{entry.gridSize} • {new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-blue-400">{entry.score}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{entry.moves} moves • {entry.time}s</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
