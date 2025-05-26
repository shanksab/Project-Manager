import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import TaskList from '../components/TaskList';
import NewProjectForm from '../components/NewProjectForm';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects...');
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        const response = await fetch(`http://localhost:8000/api/projects?user_id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          let errorMsg = 'Failed to fetch projects';
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch (jsonErr) {
            // ignore JSON parse error
          }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Projects data received:', data);
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async (newProject) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;
      console.log('Sending project data:', newProject);
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          ...newProject, 
          user_id: userId,
          deadline_date: newProject.deadline_date || null
        })
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok) {
        setProjects(prevProjects => [...prevProjects, data]);
        setIsNewProjectModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (updatedProject) => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${updatedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProject)
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const data = await response.json();
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === data.id ? data : project
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && project.status === filterStatus;
  });

  console.log('Filtered projects:', filteredProjects);

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': 'bg-blue-500',
      'Completed': 'bg-green-500',
      'On Hold': 'bg-yellow-500',
      'Delayed': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your project portfolio</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg 
                         transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="md:col-span-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500
                       text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Projects</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List View */}
      <AnimatePresence>
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8 min-h-[180px] col-span-3">
            <div className="text-gray-400 text-5xl mb-2">📁</div>
            <div className="text-lg text-gray-500 mb-1">No projects yet</div>
            <div className="text-sm text-gray-400">Create your first project to see it here.</div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden
                           transform transition-all duration-200 hover:shadow-xl hover:scale-[1.02]
                           ${viewMode === 'grid' ? '' : 'flex items-center'}
                           border-t-4 ${
                             project.status === 'completed' ? 'border-green-500' :
                             project.status === 'in_progress' ? 'border-blue-500' :
                             project.status === 'on_hold' ? 'border-yellow-500' :
                             'border-gray-500'
                           }`}
              >
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{project.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          project.status === 'completed' ? 'bg-green-500' :
                          project.status === 'in_progress' ? 'bg-blue-500' :
                          project.status === 'on_hold' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between items-center">
                      <span>Due Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {project.deadline_date ? new Date(project.deadline_date).toLocaleDateString() : 'No due date'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tasks:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.tasks?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Team Members:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.team_members?.length || 0}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateProject({ ...project, status: 'completed', progress: 100 })}
                        className="p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 
                                 bg-green-50 dark:bg-green-900/30 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50
                                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        title="Mark as Completed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleUpdateProject({ ...project, status: 'on_hold' })}
                        className="p-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 
                                 bg-yellow-50 dark:bg-yellow-900/30 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/50
                                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                        title="Put on Hold"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    <Link 
                      to={`/projects/${project.id}`}
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
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)' // For Safari support
            }}
          >
            <NewProjectForm
              onAddProject={handleAddProject}
              onClose={() => setIsNewProjectModalOpen(false)}
              availableEmployees={['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects; 