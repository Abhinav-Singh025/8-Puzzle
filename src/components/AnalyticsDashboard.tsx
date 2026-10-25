import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsDashboardProps {
  sessions: any[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center text-white/40 italic">
        No session data available for analytics.
      </div>
    );
  }

  const algorithms = [...new Set(sessions.map(s => s.algorithm))];
  
  const avgNodes = algorithms.map(algo => {
    const algoSessions = sessions.filter(s => s.algorithm === algo);
    return algoSessions.reduce((acc, s) => acc + s.nodesExplored, 0) / algoSessions.length;
  });

  const avgTime = algorithms.map(algo => {
    const algoSessions = sessions.filter(s => s.algorithm === algo);
    return algoSessions.reduce((acc, s) => acc + s.time, 0) / algoSessions.length;
  });

  const barData = {
    labels: algorithms,
    datasets: [
      {
        label: 'Avg Nodes Explored',
        data: avgNodes,
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: algorithms,
    datasets: [
      {
        label: 'Avg Computation Time (s)',
        data: avgTime,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 9 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 9 } }
      }
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Nodes Explored by Algorithm</h4>
        <Bar data={barData} options={options} />
      </div>
      <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Computation Time by Algorithm</h4>
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
