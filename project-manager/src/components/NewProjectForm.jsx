import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NewProjectForm = ({ onAddProject, onClose, availableEmployees }) => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    dueDate: '',
    startDate: '',
    teamMembers: [],
    budget: '',
    category: 'development',
    color: 'blue',
    tasks: []
  });

  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const colorOptions = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' }
  ];

  const statusOptions = [
    { name: 'Not Started', value: 'Not Started', class: 'bg-gray-500' },
    { name: 'In Progress', value: 'In Progress', class: 'bg-blue-500' },
    { name: 'On Hold', value: 'On Hold', class: 'bg-yellow-500' },
    { name: 'Completed', value: 'Completed', class: 'bg-green-500' },
    { name: 'Delayed', value: 'Delayed', class: 'bg-red-500' }
  ];

  const categoryOptions = [
    { name: 'Development', value: 'development', icon: '💻' },
    { name: 'Design', value: 'design', icon: '🎨' },
    { name: 'Marketing', value: 'marketing', icon: '📢' },
    { name: 'Research', value: 'research', icon: '🔍' },
    { name: 'Operations', value: 'operations', icon: '⚙️' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (project.title.trim()) {
      onAddProject({
        ...project,
        id: Date.now(),
        progress: 0,
        createdAt: new Date().toISOString(),
        tasks: project.tasks.map(task => ({
          id: Date.now() + Math.random(),
          text: task.text,
          priority: task.priority,
          completed: false
        }))
      });
      onClose();
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      setProject(prev => ({
        ...prev,
        tasks: [...prev.tasks, { text: newTask.trim(), priority: newTaskPriority }]
      }));
      setNewTask('');
      setNewTaskPriority('medium');
    }
  };

  const removeTask = (index) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
        {/* Basic Info Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Enter project description"
            />
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={project.startDate}
              onChange={(e) => setProject({ ...project, startDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={project.dueDate}
              onChange={(e) => setProject({ ...project, dueDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={project.status}
              onChange={(e) => setProject({ ...project, status: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category and Color */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {categoryOptions.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setProject({ ...project, category: cat.value })}
                  className={`p-3 rounded-lg border-2 transition-all
                    ${project.category === cat.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Label
            </label>
            <div className="flex space-x-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setProject({ ...project, color: color.value })}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110
                    ${color.class} ${project.color === color.value ? 'ring-2 ring-offset-2 ring-gray-600 scale-110' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team Members
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
            {availableEmployees.map((member) => (
              <label
                key={member}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={project.teamMembers.includes(member)}
                  onChange={() => {
                    setProject(prev => ({
                      ...prev,
                      teamMembers: prev.teamMembers.includes(member)
                        ? prev.teamMembers.filter(m => m !== member)
                        : [...prev.teamMembers, member]
                    }));
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900 dark:text-gray-200">{member}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Tasks
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {project.tasks.length} tasks
            </span>
          </div>
          
          <div className="space-y-2 mb-3">
            {project.tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority === 'high' ? 'High Priority' :
                     task.priority === 'medium' ? 'Medium Priority' :
                     'Low Priority'}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-200">{task.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeTask(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTask();
                }
              }}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="button"
              onClick={addTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                     hover:bg-blue-700 rounded-lg shadow-sm transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Project
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewProjectForm; 