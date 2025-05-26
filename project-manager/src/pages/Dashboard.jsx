import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import DashboardCharts from '../components/DashboardCharts';

const Dashboard = () => {
  const [data, setData] = useState({
    projects: [],
    teams: [],
    members: [],
    stats: {
      total_projects: 0,
      total_tasks: 0,
      completion_rate: 0,
      total_members: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard');
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 mt-[-28px] flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="p-8 mt-[-28px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Total Projects</h3>
          <p className="text-3xl font-bold mb-2">{data.stats.total_projects}</p>
          <div className="text-green-600 text-sm">Active projects</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold mb-2">{data.stats.total_tasks}</p>
          <div className="text-green-600 text-sm">Total tasks in progress</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold mb-2">{Math.round(data.stats.completion_rate)}%</p>
          <div className="text-green-600 text-sm">Overall progress</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Team Members</h3>
          <p className="text-3xl font-bold mb-2">{data.stats.total_members}</p>
          <div className="text-green-600 text-sm">Active team members</div>
        </div>
      </div>

      <div className="mb-8">
        <DashboardCharts projects={data.projects} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          {data.projects.slice(0, 5).map(project => (
            <div key={project.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status === 'Completed' ? '✓' : '✚'}
              </div>
              <div>
                <p className="text-gray-800">
                  Project "{project.title}" is {project.status.toLowerCase()}
                </p>
                <span className="text-sm text-gray-500">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 