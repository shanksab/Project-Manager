import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample Data
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
  },
  { 
    id: 6, 
    name: 'Emily Davis', 
    role: 'Product Manager', 
    department: 'Management',
    email: 'emily.d@company.com',
    projects: ['E-commerce Platform', 'Mobile App'],
    status: 'active'
  },
  { 
    id: 7, 
    name: 'David Lee', 
    role: 'DevOps Engineer', 
    department: 'Operations',
    email: 'david.l@company.com',
    projects: ['Cloud Migration', 'CI/CD Pipeline'],
    status: 'active'
  },
  { 
    id: 8, 
    name: 'Lisa Chen', 
    role: 'QA Engineer', 
    department: 'Quality Assurance',
    email: 'lisa.c@company.com',
    projects: ['Testing Automation', 'Quality Metrics'],
    status: 'active'
  },
  { 
    id: 9, 
    name: 'Tom Wilson', 
    role: 'System Architect', 
    department: 'Development',
    email: 'tom.w@company.com',
    projects: ['System Architecture', 'Performance Optimization'],
    status: 'active'
  },
  { 
    id: 10, 
    name: 'Rachel Green', 
    role: 'Graphic Designer', 
    department: 'Design',
    email: 'rachel.g@company.com',
    projects: ['Brand Identity', 'Marketing Materials'],
    status: 'active'
  }
];

const sampleProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    status: 'in-progress',
    progress: 65,
    members: [1, 3, 4]
  },
  {
    id: 2,
    name: 'Mobile App',
    status: 'in-progress',
    progress: 40,
    members: [1, 3, 6]
  },
  {
    id: 3,
    name: 'E-commerce Platform',
    status: 'planning',
    progress: 15,
    members: [2, 6]
  },
  {
    id: 4,
    name: 'API Integration',
    status: 'in-progress',
    progress: 80,
    members: [2, 5]
  },
  {
    id: 5,
    name: 'Dashboard UI',
    status: 'completed',
    progress: 100,
    members: [4]
  },
  {
    id: 6,
    name: 'Client Portal',
    status: 'in-progress',
    progress: 55,
    members: [4, 5]
  },
  {
    id: 7,
    name: 'Database Migration',
    status: 'planning',
    progress: 10,
    members: [5, 7]
  },
  {
    id: 8,
    name: 'Cloud Migration',
    status: 'in-progress',
    progress: 70,
    members: [7]
  },
  {
    id: 9,
    name: 'Testing Automation',
    status: 'completed',
    progress: 100,
    members: [8]
  },
  {
    id: 10,
    name: 'Brand Identity',
    status: 'in-progress',
    progress: 85,
    members: [10]
  }
];

const sampleTeams = [
  {
    id: 1,
    name: 'Frontend Team',
    members: [3, 4],
    projects: ['Website Redesign', 'Client Portal', 'Mobile App Development']
  },
  {
    id: 2,
    name: 'Backend Team',
    members: [2, 5],
    projects: ['API Integration', 'Database Migration', 'Authentication System']
  },
  {
    id: 3,
    name: 'Design Team',
    members: [3],
    projects: ['UI Kit Development', 'Brand Guidelines', 'Website Redesign']
  },
  {
    id: 4,
    name: 'Product Team',
    members: [1, 2, 3],
    projects: ['E-commerce Platform', 'Dashboard Analytics']
  },
  {
    id: 5,
    name: 'DevOps Team',
    members: [5],
    projects: ['CI/CD Pipeline', 'Cloud Infrastructure', 'Security Audit']
  },
  {
    id: 6,
    name: 'Mobile Development',
    members: [2, 4, 5],
    projects: ['Mobile App Development', 'Client Portal'],
  },
  {
    id: 7,
    name: 'QA Team',
    members: [8],
    projects: ['Testing Automation']
  },
  {
    id: 8,
    name: 'Architecture Team',
    members: [9, 5, 7],
    projects: ['Database Migration', 'Cloud Infrastructure']
  }
];

const Teams = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [members] = useState(sampleMembers || []);
  const [teams] = useState(sampleTeams || []);

  const departments = ['Management', 'Development', 'Design', 'Marketing', 'Operations'];
  const roles = ['Project Manager', 'Senior Developer', 'UI/UX Designer', 'Marketing Specialist', 'Operations Manager'];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Button text based on active tab
  const getButtonText = () => {
    switch (activeTab) {
      case 'teams':
        return 'Add Team';
      case 'team-members':
        return 'Add Team Member';
      case 'members':
        return 'Add Member';
      default:
        return 'Add New';
    }
  };

  // New Member Form State
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    skills: []
  });

  // New Team Form State
  const [newTeam, setNewTeam] = useState({
    name: '',
    teamMembers: []
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    // Add member logic here
    setShowAddModal(false);
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    // Create new team logic
    const newTeamData = {
      id: teams.length + 1,
      name: newTeam.name,
      members: newTeam.teamMembers,
      projects: [],
      lead: newTeam.teamMembers[0] || null
    };
    
    setTeams([...teams, newTeamData]);
    setNewTeam({ name: '', teamMembers: [] }); // Reset form
    setShowAddModal(false);
  };

  // Enhanced render function for teams
  const renderTeams = () => {
    if (!teams || !Array.isArray(teams)) return null;
    
    return teams.map(team => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={team.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl 
                   transform hover:-translate-y-1 transition-all duration-200 overflow-hidden
                   flex flex-col h-full"
      >
        {/* Modern Header with Accent */}
        <div className="h-2 bg-blue-500" />
        
        {/* Content Container */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Team Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{team.name}</h3>

          {/* Content Wrapper */}
          <div className="flex-1">
            {/* Members Section */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Members:</p>
              <div className="flex flex-wrap gap-2">
                {/* Show first 3 members */}
                {team.members?.slice(0, 3).map((memberId) => {
                  const member = members.find(m => m.id === memberId);
                  return member ? (
                    <div
                      key={memberId}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg 
                               flex items-center space-x-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {member.name}
                      </span>
                    </div>
                  ) : null;
                })}
                {/* Show +n if there are more than 3 members */}
                {team.members?.length > 3 && (
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      +{team.members.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Projects:</p>
              <div className="flex flex-wrap gap-2">
                {team.projects?.map((project, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-purple-50 dark:bg-purple-900/30 
                             text-purple-600 dark:text-purple-400 rounded-lg"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ));
  };

  // Enhanced render function for members
  const renderMembers = () => {
    if (!members || !Array.isArray(members)) return null;
    
    return members.map(member => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={member.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl 
                   transform hover:-translate-y-1 transition-all duration-200"
      >
        <div className="p-6">
          {/* Member Header */}
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                          flex items-center justify-center text-white text-xl font-bold">
              {member.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
            </div>
          </div>

          {/* Member Details */}
          <div className="mt-6 space-y-4">
            {/* Role & Department */}
            <div className="flex space-x-3">
              <div className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Role</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{member.role}</p>
              </div>
              <div className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{member.department}</p>
              </div>
            </div>

            {/* Projects */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Projects:</p>
              <div className="flex flex-wrap gap-2">
                {member.projects?.map((project, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 
                             text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                {member.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg 
                       transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                {activeTab === 'teams' ? 'Add Team' : 'Add Member'}
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-4 text-sm font-medium transition-colors relative
                ${activeTab === 'teams' 
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Teams
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-4 text-sm font-medium transition-colors relative
                ${activeTab === 'members' 
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Members
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'teams' && renderTeams()}
        {activeTab === 'members' && renderMembers()}
      </div>

      {/* Add Team Modal */}
      <AnimatePresence>
        {showAddModal && activeTab === 'teams' && (
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Team</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddTeam} className="p-4 space-y-4">
                {/* Team Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter team name"
                  />
                </div>

                {/* Team Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Members
                  </label>
                  <div className="space-y-1 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {members.map((member) => (
                      <label
                        key={member.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newTeam.teamMembers.includes(member.id)}
                          onChange={() => {
                            setNewTeam(prev => ({
                              ...prev,
                              teamMembers: prev.teamMembers.includes(member.id)
                                ? prev.teamMembers.filter(id => id !== member.id)
                                : [...prev.teamMembers, member.id]
                            }));
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-200">{member.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
                    Create Team
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && activeTab === 'members' && (
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Member</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddMember} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Enter member's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Role and Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <select
                      value={newMember.department}
                      onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="Enter skills (comma separated)"
                    value={newMember.skills.join(', ')}
                    onChange={(e) => setNewMember({
                      ...newMember,
                      skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Separate skills with commas (e.g., React, Node.js, UI Design)
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
                    Add Member
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams; 