import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  // Default values if project data is missing
  const {
    title = 'Untitled Project',
    description = 'No description available',
    status = 'Not Started',
    progress = 0,
    tasks = [],
    team_members = [],
    due_date = null
  } = project || {};

  // Super simple date display
  const showDate = (dateString) => {
    if (!dateString) return 'No due date';
    return dateString.split('T')[0]; // Just show YYYY-MM-DD
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          status === 'Completed' ? 'bg-green-100 text-green-800' :
          status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Due Date:</span>
          <span className="font-medium">{showDate(due_date)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tasks: {tasks.length}</span>
          <span>Members: {team_members.length}</span>
        </div>
        <div className="flex justify-end mt-2">
          <Link 
            to={`/projects/${project?.id || '1'}`}
            className="text-blue-500 hover:text-blue-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 