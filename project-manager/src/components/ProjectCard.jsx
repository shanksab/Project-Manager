import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onUpdateProject }) => {
  // Default values if project data is missing
  const {
    title = 'Untitled Project',
    description = 'No description available',
    status = 'Not Started',
    progress = 0,
    tasks = [],
    team_members = [],
    deadline_date = null
  } = project || {};

  // Super simple date display
  const showDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // This will format the date nicely
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...project,
          status: 'Completed',
          progress: 100
        })
      });

      if (response.ok) {
        const updatedProject = await response.json();
        onUpdateProject(updatedProject);
      } else {
        console.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleHoldProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...project,
          status: 'On Hold'
        })
      });

      if (response.ok) {
        const updatedProject = await response.json();
        onUpdateProject(updatedProject);
      } else {
        console.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          status === 'On Hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {status}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">{description}</p>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${
              status === 'Completed' ? 'bg-green-500' :
              status === 'In Progress' ? 'bg-blue-500' :
              status === 'On Hold' ? 'bg-yellow-500' :
              'bg-gray-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex justify-between items-center">
          <span>Due Date:</span>
          <span className="font-medium text-gray-900 dark:text-white">{showDate(deadline_date)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Tasks:</span>
          <span className="font-medium text-gray-900 dark:text-white">{tasks.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Team Members:</span>
          <span className="font-medium text-gray-900 dark:text-white">{team_members.length}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            {status === 'In Progress' && (
              <>
                <button
                  onClick={handleMarkAsCompleted}
                  className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 
                           bg-green-50 dark:bg-green-900/30 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  title="Mark as Completed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleHoldProject}
                  className="p-1.5 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 
                           bg-yellow-50 dark:bg-yellow-900/30 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/50
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                  title="Hold Project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <Link 
            to={`/projects/${project?.id || '1'}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                     font-medium transition-colors duration-200 flex items-center space-x-1"
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 