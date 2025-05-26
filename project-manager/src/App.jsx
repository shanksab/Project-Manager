import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Teams from './pages/Teams';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token and user data in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log('Token found:', !!token); // Debug log
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      console.log('Setting isAuthenticated to true'); // Debug log
    } else {
      setIsAuthenticated(false);
      setUser(null);
      console.log('Setting isAuthenticated to false'); // Debug log
    }
  }, []);

  // Add a function to handle authentication state
  const handleAuthStateChange = (state) => {
    setIsAuthenticated(state);
    if (!state) {
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const notifications = [
    { id: 1, text: 'New project assigned', time: '5m ago' },
    { id: 2, text: 'Meeting in 30 minutes', time: '30m ago' },
    { id: 3, text: 'Task deadline approaching', time: '1h ago' },
  ];

  // Layout component for authenticated pages
  const AuthenticatedLayout = ({ children }) => (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ProjectManager</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl
                         transition-all duration-200 group hover:bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                         hover:text-white"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl
                         transition-all duration-200 group hover:bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                         hover:text-white"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">Projects</span>
              </Link>
            </li>
            <li>
              <Link
                to="/statistics"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl
                         transition-all duration-200 group hover:bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                         hover:text-white"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Statistics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/teams"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl
                         transition-all duration-200 group hover:bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                         hover:text-white"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">Teams</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl
                         transition-all duration-200 group hover:bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                         hover:text-white"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Calendar</span>
              </Link>
            </li>
          </ul>

          {/* User Profile */}
          <div className="fixed bottom-0 left-0 right-0 p-4">
            <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                             flex items-center justify-center text-white font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'User'}</p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onAuthStateChange={handleAuthStateChange} />} />
        <Route path="/signup" element={<Signup onAuthStateChange={handleAuthStateChange} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <AuthenticatedLayout>
                <Projects />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/statistics"
          element={
            isAuthenticated ? (
              <AuthenticatedLayout>
                <Statistics />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/teams"
          element={
            isAuthenticated ? (
              <AuthenticatedLayout>
                <Teams />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/calendar"
          element={
            isAuthenticated ? (
              <AuthenticatedLayout>
                <Calendar />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;