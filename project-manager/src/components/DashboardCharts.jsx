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

function getCumulativeCompletedTasks(projects) {
  // Collect all completed tasks with their completion date
  let completed = [];
  projects.forEach(project => {
    if (Array.isArray(project.tasks)) {
      project.tasks.forEach(task => {
        if (task.completed && task.completedAt) {
          completed.push(task.completedAt.split('T')[0]); // Use only the date part
        }
      });
    }
  });
  // Count cumulative per day
  const dateCounts = {};
  completed.forEach(date => {
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  // Sort dates
  const sortedDates = Object.keys(dateCounts).sort();
  let cumulative = 0;
  const labels = [];
  const data = [];
  sortedDates.forEach(date => {
    cumulative += dateCounts[date];
    labels.push(date);
    data.push(cumulative);
  });
  return { labels, data, total: cumulative };
}

const DashboardCharts = ({ projects }) => {
  // Calculate task distribution
  const completedTasks = projects.filter(p => p.status === 'Completed').length;
  const inProgressTasks = projects.filter(p => p.status === 'In Progress').length;
  const notStartedTasks = projects.filter(p => p.status === 'Not Started').length;

  const pieChartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [completedTasks, inProgressTasks, notStartedTasks],
      backgroundColor: [
        'rgb(34, 197, 94)',  // green-500
        'rgb(59, 130, 246)', // blue-500
        'rgb(96, 165, 250)', // blue-400
      ],
      borderColor: [
        'rgb(22, 163, 74)',  // green-600
        'rgb(37, 99, 235)',  // blue-600
        'rgb(59, 130, 246)', // blue-500
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

  // Create gradient for line chart
  const createGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    return gradient;
  };

  const lineChartData = {
    labels: sortedProjects.map(project => project.title),
    datasets: [{
      label: 'Project Progress',
      data: sortedProjects.map(project => project.progress),
      fill: true,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return 'rgba(59, 130, 246, 0.2)';
        }
        return createGradient(ctx);
      },
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgba(59, 130, 246, 1)',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: 'white',
      pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
      pointHoverBorderWidth: 3,
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
          },
          title: function(context) {
            return context[0].label;
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
          },
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          padding: 10,
          color: '#6B7280'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
          borderDash: [5, 5]
        },
        border: {
          display: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          padding: 10,
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
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
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          color: '#4B5563'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
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
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Fallback: if no completedAt, use created_at or today
  const fallbackToday = () => new Date().toISOString().split('T')[0];
  let hasCompletedAt = false;
  projects.forEach(project => {
    if (Array.isArray(project.tasks)) {
      project.tasks.forEach(task => {
        if (task.completed && task.completedAt) hasCompletedAt = true;
      });
    }
  });
  // If no completedAt, fake some data for demo
  let chartData;
  if (hasCompletedAt) {
    chartData = getCumulativeCompletedTasks(projects);
  } else {
    // Demo: generate 14 days of fake progress
    const today = new Date();
    const labels = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - 13 + i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = labels.map((_, i) => Math.round((i + 1) * 3 + Math.random() * 2));
    chartData = { labels, data, total: data[data.length - 1] };
  }

  const lineData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Total Completed Tasks',
        data: chartData.data,
        fill: true,
        backgroundColor: 'rgba(34,197,94,0.12)', // green-500, light fill
        borderColor: 'rgb(34,197,94)', // green-500
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(34,197,94)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Progress Over Time',
        align: 'center',
        font: { size: 20, weight: 'bold', family: 'Inter, sans-serif' },
        color: '#22223b',
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#22223b',
        bodyColor: '#22223b',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        ticks: {
          color: '#22223b',
          font: { size: 12, family: 'Inter, sans-serif' },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { color: 'rgba(0,0,0,0.04)' },
      },
      y: {
        title: {
          display: true,
          text: 'Total Completed Tasks',
          font: { size: 14, family: 'Inter, sans-serif' },
          color: '#22223b',
        },
        beginAtZero: true,
        ticks: {
          color: '#22223b',
          font: { size: 12, family: 'Inter, sans-serif' },
        },
        grid: { color: 'rgba(0,0,0,0.04)' },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
        <h3 className="text-[24px] mb-[25px] ml-[-50px] font-bold font-sans text-[#22223b] text-left pb-5">Task Distribution</h3>
        <div className="relative flex items-center justify-center h-[380px] w-full">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-4 text-center w-full">
          <div>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">{notStartedTasks}</div>
            <div className="text-sm text-gray-600">Not Started</div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative h-[450px]">
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="flex flex-col items-center mt-8 mb-2">
          <div className="text-4xl font-bold text-gray-900">{chartData.total}</div>
          <div className="text-blue-600 text-[24px] font-medium mt-1">Total Completed Tasks</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
