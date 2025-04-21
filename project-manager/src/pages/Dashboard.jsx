import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import DashboardCharts from '../components/DashboardCharts';
import NewProjectForm from '../components/NewProjectForm';

const Dashboard = ({ projects, onAddProject }) => {
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter(task => task.completed).length,
    0
  );
  const inProgressTasks = totalTasks - completedTasks;
  const notStartedTasks = 0; // Assuming no tasks are not started
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get all unique employees across projects
  const availableEmployees = [...new Set(projects.flatMap(project => project.teamMembers))];

  // Update the pie chart data configuration
  const pieChartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [completedTasks, inProgressTasks, notStartedTasks],
      backgroundColor: [
        'rgb(59, 130, 246)', // blue-500
        'rgb(96, 165, 250)', // blue-400
        'rgb(147, 197, 253)', // blue-300
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // If you have options configured separately, ensure they maintain consistency
  const pieChartOptions = {
    responsive: true,
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
          <p className="text-3xl font-bold mb-2">{totalProjects}</p>
          <div className="text-green-600 text-sm">+2 this month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold mb-2">{totalTasks}</p>
          <div className="text-green-600 text-sm">+5 this week</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold mb-2">{progressPercentage}%</p>
          <div className="text-green-600 text-sm">+10% this month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Team Members</h3>
          <p className="text-3xl font-bold mb-2">
            {projects.reduce((acc, project) => acc + project.teamMembers.length, 0)}
          </p>
          <div className="text-green-600 text-sm">+3 this month</div>
        </div>
      </div>

      <div className="mb-8">
        <DashboardCharts projects={projects} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          {projects.flatMap(project => 
            project.tasks.map(task => ({
              id: task.id,
              project: project.title,
              task: task.text,
              status: task.completed ? 'completed' : 'created',
              date: new Date().toISOString().split('T')[0]
            }))
          ).slice(0, 5).map(activity => (
            <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {activity.status === 'completed' ? '✓' : '✚'}
              </div>
              <div>
                <p className="text-gray-800">
                  Task "{activity.task}" was {activity.status} in {activity.project}
                </p>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 