import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap'; // Assuming you're using React Bootstrap

const DashboardCardSettings = ({ allProjects, settings, updateSettings }) => {
  const [displayOption, setDisplayOption] = useState('projects');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const handleDisplayChange = (event) => {
    setDisplayOption(event.target.value);
    updateSettings({ ...settings, displayOption: event.target.value });
  }

  // When the display option changes, update the state and notify the parent component
  const handleProjectSelectionChange = (projectId) => {
    const newSelectedProjects = selectedProjects.includes(projectId)
      ? selectedProjects.filter(id => id === projectId)
      : [...selectedProjects, projectId];
  
    setSelectedProjects(newSelectedProjects);
    updateSettings({ ...settings, selectedProjects: newSelectedProjects });
  };

  useEffect(() => {
    if (!loaded) {
        console.log("Selected project settings", settings.selectedProjects);
        if (settings.selectedProjects[0] === "all") {
            setSelectedProjects(allProjects.map(project => project.Title));
        }
        else {
            setSelectedProjects(settings.selectedProjects);
        }
    }
    setLoaded(true);
  }, [allProjects]);

  return (
      <Card.Body>
        <div>
          <label>
            <input
              type="radio"
              value="projects"
              checked={displayOption === 'projects'}
              onChange={handleDisplayChange}
            />
            Projects
          </label>
          <label>
            <input
              type="radio"
              value="graph"
              checked={displayOption === 'graph'}
              onChange={handleDisplayChange}
            />
            Graph
          </label>
        </div>

        {displayOption === 'projects' && (
          <div>
            <h3>Select Projects:</h3>
            {allProjects.map(project => (
              <label key={project.Title}>
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.Title)}
                  onChange={() => handleProjectSelectionChange(project.Title)}
                />
                {project.Title}
              </label>
            ))}
          </div>
        )}
      </Card.Body>
  );
};

export default DashboardCardSettings;
