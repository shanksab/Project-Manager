import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCard = ({ project, onUpdateProject }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(project?.progress || 0);
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'Not Started');
  
  // Update local progress when project prop changes
  useEffect(() => {
    setCurrentProgress(project?.progress || 0);
    setCurrentStatus(project?.status || 'Not Started');
  }, [project?.progress, project?.status]);

  // Default values if project data is missing
  const {
    title = 'Untitled Project',
    description = 'No description available',
    status = 'Not Started',
    tasks = [],
    team_members = [],
    deadline_date = null
  } = project || {};

  // Super simple date display
  const showDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Function to determine status based on progress
  const getStatusFromProgress = (progress) => {
    if (progress === 100) return 'completed';
    if (progress > 0 && progress < 100) return 'in_progress';
    return 'not_started';
  };

  // Function to get status color classes
  const getStatusColorClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
          status: 'completed',
          progress: 100
        })
      });

      if (response.ok) {
        const updatedProject = await response.json();
        onUpdateProject(updatedProject);
        setCurrentProgress(100);
        setCurrentStatus('completed');
      } else {
        console.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleUpdateTask = async (taskId, isCompleted) => {
    try {
      // First, update the task's completion status
      const taskResponse = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          is_completed: isCompleted,
          status: isCompleted ? 1 : 0
        })
      });

      if (!taskResponse.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await taskResponse.json();

      // Create updated tasks array with the new status
      const updatedTasks = project.tasks.map(task => {
        if (task.id === taskId) {
          return { 
            ...task, 
            is_completed: isCompleted, 
            status: isCompleted ? 1 : 0,
            completed: isCompleted // Add this to ensure the completed state is tracked
          };
        }
        return task;
      });

      // Calculate new progress based on completed tasks
      const completedTasks = updatedTasks.filter(task => task.status === 1).length;
      const totalTasks = updatedTasks.length;
      const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const newStatus = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'not_started';

      // Update the project with new tasks and progress
      const projectData = {
        ...project,
        status: newStatus,
        progress: newProgress,
        tasks: updatedTasks
      };

      const projectResponse = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!projectResponse.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await projectResponse.json();

      // Update local state
      setCurrentProgress(newProgress);
      setCurrentStatus(newStatus);
      
      // Force a re-render by updating the project state
      if (onUpdateProject) {
        onUpdateProject(updatedProject);
      } else {
        // If onUpdateProject is not available, update the local project state
        project.tasks = updatedTasks;
        project.progress = newProgress;
        project.status = newStatus;
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUpdateProgress = async (newProgress) => {
    try {
      // Update local state immediately
      setCurrentProgress(newProgress);
      
      // Update project with new progress
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...project,
          progress: newProgress
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      onUpdateProject(updatedProject);
    } catch (error) {
      console.error('Error updating project progress:', error);
      setCurrentProgress(project.progress); // Revert on error
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden
                     transform transition-all duration-200 hover:shadow-xl hover:scale-[1.02]
                     border border-gray-100 dark:border-gray-700 relative">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClasses(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>

        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">{description}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{showDate(deadline_date)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm">{tasks.length} Tasks</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-2">
              {currentStatus === 'completed' ? (
                <span className="px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400 
                               bg-green-50 dark:bg-green-900/30 rounded-lg">
                  Completed
                </span>
              ) : (
                <button
                  onClick={handleMarkAsCompleted}
                  className="p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 
                           bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  title="Mark as Completed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowDetailsModal(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                       font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      readOnly
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      readOnly
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Status and Progress */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <div className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                  bg-gray-50 dark:bg-gray-700">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClasses(currentStatus)}`}>
                        {currentStatus}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Progress
                    </label>
                    <div className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                  bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${currentProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {currentProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Team Members
                  </label>
                  <div className="space-y-2">
                    {team_members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 
                                 rounded-lg"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                                      flex items-center justify-center text-white text-sm font-bold">
                          {member.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <motion.div 
                        key={task.id} 
                        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {task.title || 'Untitled Task'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {task.text}
                            </p>
                          </div>
                          <div
                            onClick={() => handleUpdateTask(task.id, !task.is_completed)}
                            className={`ml-4 p-2 rounded-full cursor-pointer transition-colors duration-200
                              ${task.status === 1 
                                ? 'bg-green-100 dark:bg-green-900/50' 
                                : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50'
                              }`}
                          >
                            {task.status === 1 ? (
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                Completed
                              </span>
                            ) : (
                              <svg
                                className="w-5 h-5 text-green-600 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deadline
                  </label>
                  <div className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                bg-gray-50 dark:bg-gray-700">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {showDate(deadline_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                             hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard; 