import React, { useState } from 'react';
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
    status: 'In Progress',
    due_date: '',
    team_members: [],
    progress: 0
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onAddProject(data);
        onClose();
      } else {
        console.error('Server Error:', data);
        alert(`Failed to create project: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert(`Error creating project: ${error.message}`);
    }
  };

  const handleTeamMemberChange = (userId) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.includes(userId)
        ? prev.team_members.filter(id => id !== userId)
        : [...prev.team_members, userId]
    }));
  };

  const filteredMembers = sampleMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMembers = sampleMembers.filter(member => 
    formData.team_members.includes(member.id)
  );

  return (
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows="3"
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        {/* Team Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team Members
          </label>
          
          {/* Selected Team Members */}
          {selectedMembers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Members:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{member.name}</span>
                    <button
                      type="button"
                      onClick={() => handleTeamMemberChange(member.id)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Select */}
          <div className="space-y-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team members by name, email, or role..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
              {filteredMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.team_members.includes(member.id)}
                    onChange={() => handleTeamMemberChange(member.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{member.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {member.role} • {member.email}
                    </div>
                  </div>
                </label>
              ))}
              {filteredMembers.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm p-2">
                  No team members found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>

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