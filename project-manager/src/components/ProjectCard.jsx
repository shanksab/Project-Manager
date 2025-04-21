import React, { useEffect, useRef } from 'react';

const ProjectCard = ({ project }) => {
  const { title, description, progress, teamMembers, dueDate } = project;
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
      setTimeout(() => {
        progressBarRef.current.style.width = `${progress}%`;
      }, 100);
    }
  }, [progress]);

  const getDueDateStatus = () => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    } else if (diffDays <= 7) {
      return { text: 'Due soon', color: 'text-yellow-600' };
    } else {
      return { text: 'On track', color: 'text-green-600' };
    }
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {dueDateStatus && (
            <span className={`text-sm font-medium ${dueDateStatus.color}`}>
              {dueDateStatus.text}
            </span>
          )}
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {progress}%
          </span>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            ref={progressBarRef}
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: '0%' }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white"
            >
              {member.charAt(0)}
            </div>
          ))}
        </div>
        {dueDate && (
          <span className="text-sm text-gray-600">
            Due: {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 