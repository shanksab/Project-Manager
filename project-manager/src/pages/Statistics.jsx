import React, { useState, useEffect } from 'react';
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
  const [projectProgressData, setProjectProgressData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Completed Projects',
        data: [],
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  });

  const [taskDistributionData, setTaskDistributionData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
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
  });

  const [teamPerformanceData, setTeamPerformanceData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Current Performance',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
      }
    ]
  });

  const [taskCompletionData, setTaskCompletionData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'New Tasks',
        data: [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        const response = await fetch(`http://localhost:8000/api/statistics?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setProjectProgressData(data.projectProgress);
        setTaskDistributionData(data.taskDistribution);
        setTeamPerformanceData(data.teamPerformance);
        setTaskCompletionData(data.taskCompletion);
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('No data for statistics. Please add some projects to see statistics here.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
      {projectProgressData.datasets[0].data.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8 min-h-[180px] col-span-3">
          <div className="text-gray-400 text-5xl mb-2">📊</div>
          <div className="text-lg text-gray-500 mb-1">No statistics available</div>
          <div className="text-sm text-gray-400">Add some projects to see statistics here.</div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Statistics; 