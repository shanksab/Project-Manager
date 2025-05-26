import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Sample team members from Teams.jsx
const sampleMembers = [
  { 
    id: 1, 
    name: 'John Doe', 
    role: 'Project Manager', 
    department: 'Management',
    email: 'john.doe@company.com',
    projects: ['E-commerce Platform', 'Mobile App Development'],
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    role: 'Senior Developer', 
    department: 'Development',
    email: 'jane.smith@company.com',
    projects: ['Dashboard Analytics', 'API Integration'],
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    role: 'UI/UX Designer', 
    department: 'Design',
    email: 'mike.j@company.com',
    projects: ['Website Redesign', 'Mobile App Development'],
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Sarah Wilson', 
    role: 'Frontend Developer', 
    department: 'Development',
    email: 'sarah.w@company.com',
    projects: ['Client Portal', 'Website Redesign'],
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Alex Brown', 
    role: 'Backend Developer', 
    department: 'Development',
    email: 'alex.b@company.com',
    projects: ['API Integration', 'Database Migration'],
    status: 'active'
  }
];

const NewProjectForm = ({ onAddProject, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not_started',
    progress: 0,
    team_members: [],
    deadline_date: ''
  });

  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/teams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onAddProject(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMemberChange = (e) => {
    const selectedTeam = teams.find(team => team.id === parseInt(e.target.value));
    if (selectedTeam) {
      setFormData(prev => ({
        ...prev,
        team_members: selectedTeam.members || []
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows="3"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        {/* Progress */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Progress (%)
          </label>
          <input
            type="number"
            id="progress"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Deadline Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deadline Date
          </label>
          <input
            type="date"
            id="deadline_date"
            name="deadline_date"
            value={formData.deadline_date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Team Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Team
          </label>
          <select
            onChange={handleTeamMemberChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select a team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Team Members Display */}
        {formData.team_members.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selected Team Members
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <ul className="space-y-2">
                {formData.team_members.map((member, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                     hover:bg-blue-700 rounded-lg"
          >
            Create Project
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewProjectForm; 