import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import DashboardCharts from '../components/DashboardCharts';
import NewProjectForm from '../components/NewProjectForm';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async (newProject) => {
    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      setProjects(prevProjects => [data, ...prevProjects]);
      setShowNewProjectForm(false);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, project) => acc + (project.tasks?.length || 0), 0);
  const completedTasks = projects.reduce(
    (acc, project) => acc + (project.tasks?.filter(task => task.status === 1).length || 0),
    0
  );
  const inProgressTasks = totalTasks - completedTasks;
  const notStartedTasks = 0; // Assuming no tasks are not started
  const completedProjects = projects.filter(project => project.status === 'completed').length;
  const progressPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  // Get all unique employees across projects
  const availableEmployees = [...new Set(projects.flatMap(project => project.team_members || []))];

  // Calculate monthly changes
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const projectsThisMonth = projects.filter(project => {
    const projectDate = new Date(project.created_at);
    return projectDate.getMonth() === currentMonth && projectDate.getFullYear() === currentYear;
  }).length;

  const tasksThisWeek = projects.reduce((acc, project) => {
    const projectTasks = project.tasks || [];
    const tasksThisWeek = projectTasks.filter(task => {
      const taskDate = new Date(task.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return taskDate >= oneWeekAgo;
    }).length;
    return acc + tasksThisWeek;
  }, 0);

  const lastMonthCompleted = projects.filter(project => {
    const projectDate = new Date(project.created_at);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return projectDate.getMonth() === lastMonth.getMonth() && 
           projectDate.getFullYear() === lastMonth.getFullYear() &&
           project.status === 'completed';
  }).length;

  const lastMonthTotal = projects.filter(project => {
    const projectDate = new Date(project.created_at);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return projectDate.getMonth() === lastMonth.getMonth() && 
           projectDate.getFullYear() === lastMonth.getFullYear();
  }).length;

  const lastMonthProgress = lastMonthTotal > 0 ? Math.round((lastMonthCompleted / lastMonthTotal) * 100) : 0;
  const progressChange = progressPercentage - lastMonthProgress;

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
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Total Projects</h3>
          <p className="text-3xl font-bold mb-2">{totalProjects}</p>
          <div className={`${projectsThisMonth > 0 ? 'text-green-600' : 'text-gray-600'} text-sm`}>
            {projectsThisMonth > 0 ? `+${projectsThisMonth} this month` : 'No new projects this month'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold mb-2">{totalTasks}</p>
          <div className="text-gray-600 text-sm">
            {completedTasks} completed tasks
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold mb-2">{progressPercentage}%</p>
          <div className={`${progressChange > 0 ? 'text-green-600' : progressChange < 0 ? 'text-red-600' : 'text-gray-600'} text-sm`}>
            {completedProjects} of {totalProjects} projects completed
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 mb-2">Team Members</h3>
          <p className="text-3xl font-bold mb-2">{availableEmployees.length}</p>
          <div className="text-gray-600 text-sm">
            {availableEmployees.length} active members
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Charts</h2>
        <DashboardCharts projects={projects} />
      </div>

      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {projects.some(project => project.tasks?.length > 0) && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {projects.flatMap(project => 
              (project.tasks || []).map(task => ({
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
      )}

      {showNewProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <NewProjectForm
            onAddProject={handleAddProject}
            onClose={() => setShowNewProjectForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard; 