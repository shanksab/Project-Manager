import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

const DashboardCharts = ({ projects }) => {
  // Calculate project status distribution
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
  const notStartedProjects = projects.filter(p => p.status === 'not_started').length;
  const onHoldProjects = projects.filter(p => p.status === 'on_hold').length;

  const pieChartData = {
    labels: ['Completed', 'In Progress', 'Not Started', 'On Hold'],
    datasets: [{
      data: [completedProjects, inProgressProjects, notStartedProjects, onHoldProjects],
      backgroundColor: [
        'rgb(34, 197, 94)',  // green-500
        'rgb(59, 130, 246)', // blue-500
        'rgb(245, 158, 11)', // amber-500
        'rgb(234, 179, 8)',  // yellow-500
      ],
      borderColor: [
        'rgb(22, 163, 74)',  // green-600
        'rgb(37, 99, 235)',  // blue-600
        'rgb(217, 119, 6)',  // amber-600
        'rgb(202, 138, 4)',  // yellow-600
      ],
      borderWidth: 2,
      hoverOffset: 15,
      hoverBorderWidth: 3,
    }]
  };

  // Sort projects by creation date
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(a.created_at) - new Date(b.created_at)
  );

  const lineChartData = {
    labels: sortedProjects.map(project => project.title),
    datasets: [{
      label: 'Project Progress',
      data: sortedProjects.map(project => project.progress),
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgba(59, 130, 246, 1)',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Progress: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const chartColors = {
    'Completed': '#10B981', // Green
    'In Progress': '#3B82F6', // Blue
    'Not Started': '#F59E0B', // Amber/Orange
    'On Hold': '#6B7280', // Gray
    'Delayed': '#EF4444' // Red
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-gray-400 text-5xl mb-4">📊</div>
        <div className="text-lg text-gray-500 mb-2">No data yet</div>
        <div className="text-sm text-gray-400">Create your first project to see your progress here.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status Distribution</h3>
        <div className="h-80">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Progress Timeline</h3>
        <div className="h-80">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
