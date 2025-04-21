import React from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Statistics = () => {
  // Project Progress Over Time
  const projectProgressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Projects',
        data: [5, 8, 12, 15, 18, 22],
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Task Distribution by Department
  const taskDistributionData = {
    labels: ['Development', 'Design', 'Marketing', 'Management', 'Operations'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          'rgb(59, 130, 246)', // blue-500
          'rgb(99, 102, 241)', // indigo-500
          'rgb(139, 92, 246)', // purple-500
          'rgb(168, 85, 247)', // violet-500
          'rgb(217, 70, 239)', // pink-500
        ],
        borderWidth: 0,
      }
    ]
  };

  // Team Performance Metrics
  const teamPerformanceData = {
    labels: [
      'Task Completion',
      'Code Quality',
      'Communication',
      'Innovation',
      'Deadline Adherence',
      'Collaboration'
    ],
    datasets: [
      {
        label: 'Current Performance',
        data: [90, 85, 95, 80, 88, 92],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
      }
    ]
  };

  // Monthly Task Completion
  const taskCompletionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [28, 35, 42, 38],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'New Tasks',
        data: [32, 38, 40, 35],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive project and team analytics</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Project Progress Over Time
          </h2>
          <div className="h-80">
            <Line 
              data={projectProgressData} 
              options={{
                ...commonOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(107, 114, 128, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Task Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Task Distribution by Department
          </h2>
          <div className="h-80">
            <Doughnut 
              data={taskDistributionData} 
              options={{
                ...commonOptions,
                cutout: '60%'
              }}
            />
          </div>
        </div>

        {/* Team Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Team Performance Metrics
          </h2>
          <div className="h-80">
            <Radar 
              data={teamPerformanceData} 
              options={{
                ...commonOptions,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 20
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Task Completion Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Task Completion
          </h2>
          <div className="h-80">
            <Bar 
              data={taskCompletionData} 
              options={{
                ...commonOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(107, 114, 128, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 