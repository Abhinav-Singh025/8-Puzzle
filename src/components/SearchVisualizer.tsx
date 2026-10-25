import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchVisualizerProps {
  currentBoard: number[];
  frontierSize: number;
  visitedSize: number;
  nodesExpanded: number;
  algorithm: string;
  isComputing: boolean;
}

const SearchVisualizer: React.FC<SearchVisualizerProps> = ({
  currentBoard,
  frontierSize,
  visitedSize,
  nodesExpanded,
  algorithm,
  isComputing
}) => {
  if (!isComputing && nodesExpanded === 0) return null;

  return (
    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 space-y-6 shadow-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
          <i className={`fas fa-microchip ${isComputing ? 'animate-spin' : ''}`}></i>
          Search Process: {algorithm}
        </h3>
        {isComputing && (
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-ping"></span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-[10px] text-white/40 uppercase mb-1">Frontier</p>
          <p className="text-xl font-black text-purple-400">{frontierSize}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-[10px] text-white/40 uppercase mb-1">Visited</p>
          <p className="text-xl font-black text-blue-400">{visitedSize}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-[10px] text-white/40 uppercase mb-1">Expanded</p>
          <p className="text-xl font-black text-emerald-400">{nodesExpanded}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] text-white/40 uppercase tracking-widest">Current State Exploration</p>
        <div className="grid grid-cols-3 gap-1 w-24 mx-auto bg-white/5 p-1 rounded-lg border border-white/10">
          {currentBoard.map((val, i) => (
            <div 
              key={i} 
              className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-sm ${val === 0 ? 'bg-transparent' : 'bg-white/10 text-white'}`}
            >
              {val !== 0 ? val : ''}
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Simple Tree Visualization Placeholder */}
          <div className="relative w-full h-full p-4">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            />
            <div className="absolute top-12 left-1/4 w-3 h-3 bg-blue-500/50 rounded-full" />
            <div className="absolute top-12 right-1/4 w-3 h-3 bg-blue-500/50 rounded-full" />
            <div className="absolute top-20 left-1/8 w-2 h-2 bg-white/20 rounded-full" />
            <div className="absolute top-20 left-3/8 w-2 h-2 bg-white/20 rounded-full" />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="50%" y1="20" x2="25%" y2="50" stroke="white" strokeWidth="1" />
              <line x1="50%" y1="20" x2="75%" y2="50" stroke="white" strokeWidth="1" />
              <line x1="25%" y1="50" x2="12.5%" y2="80" stroke="white" strokeWidth="1" />
              <line x1="25%" y1="50" x2="37.5%" y2="80" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 text-[8px] text-white/20 uppercase font-mono">
          Search Tree Depth: {Math.floor(nodesExpanded / 100)}
        </div>
      </div>
    </div>
  );
};

export default SearchVisualizer;
