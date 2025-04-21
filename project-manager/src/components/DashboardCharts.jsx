import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = ({ projects }) => {
  // Task Status Breakdown data calculation
  const taskStatusData = {
    todo: 0,
    inProgress: 0,
    done: 0
  };

  projects.forEach(project => {
    project.tasks.forEach(task => {
      if (task.completed) {
        taskStatusData.done += 1;
      } else if (task.status === 'in_progress') {
        taskStatusData.inProgress += 1;
      } else {
        taskStatusData.todo += 1;
      }
    });
  });

  // Doughnut chart data
  const doughnutData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        data: [taskStatusData.todo, taskStatusData.inProgress, taskStatusData.done],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // red
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(34, 197, 94, 0.8)', // green
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Generate sample progress data for the last 14 days
  const today = new Date();
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (13 - i));
    return date.toISOString().split('T')[0];
  });

  // Generate realistic sample progress data
  const sampleProgressData = (() => {
    let total = 0;
    return last14Days.map((_, index) => {
      // Add between 2-5 completed tasks per day
      const dailyCompleted = Math.floor(Math.random() * 4) + 2;
      total += dailyCompleted;
      return total;
    });
  })();

  // Progress Line chart data
  const progressChartData = {
    labels: last14Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Completed Tasks',
        data: sampleProgressData,
        borderColor: 'rgba(34, 197, 94, 1)', // green
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      }
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
  };

  const progressOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Total Completed: ${context.raw} tasks`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 5,
          precision: 0
        },
        title: {
          display: true,
          text: 'Total Completed Tasks'
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Task Status Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Task Status Breakdown
        </h3>
        <div className="h-[300px] relative">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'To Do', value: taskStatusData.todo },
            { label: 'In Progress', value: taskStatusData.inProgress },
            { label: 'Done', value: taskStatusData.done }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Over Time */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Progress Over Time
        </h3>
        <div className="h-[300px] relative">
          <Line data={progressChartData} options={progressOptions} />
        </div>
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {sampleProgressData[sampleProgressData.length - 1]}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Completed Tasks
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
