import React, { useState, useEffect } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap'; // Assuming you're using React Bootstrap
import styles from './DashboardLayout.module.css';

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
    console.log("Settings are", settings)
    if (!loaded) {
        console.log("Selected project settings", settings);
        setDisplayOption(settings.displayOption);
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
          <label>
            <input
              type="radio"
              value="calendar"
              checked={displayOption === 'calendar'}
              onChange={handleDisplayChange}
            />
            Calendar
          </label>
        </div>

        {(displayOption === 'projects' || displayOption == 'graph' )&& (
          <div style={{overflowX: "scroll"}}>
            <h3>Select Projects:</h3>
            <ButtonGroup>
              {allProjects.map((project) => (
                <Button className={`${styles.btnCustomColor}`}
                  key={project.Title}
                  variant={selectedProjects.includes(project.Title) ? 'primary' : 'secondary'}
                  onClick={() => handleProjectSelectionChange(project.Title)}
                  active={selectedProjects.includes(project.Title)}
                >
                  {project.Title}
                </Button>
              ))}
            </ButtonGroup>
          </div>
      )}

      </Card.Body>
  );
};

export default DashboardCardSettings;
