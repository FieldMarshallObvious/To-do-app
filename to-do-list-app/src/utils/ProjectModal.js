import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ProjectModal({ show, onHide, onCreateProject = null, createProject = null, isEditProject=false, editProject=null, onEditProject=null, oldProjectTitle = '', oldProjectDescription = '', oldProjectColor = '#0057FF' }) {
  const [projectTitle, setProjectTitle] = useState( oldProjectTitle );
  const [projectDescription,  setProjectDescription] = useState(oldProjectDescription);
  const [projectColor, setProjectColor] = useState( oldProjectColor ? oldProjectColor:'#0057FF'); // Default color

  console.log("Old Project title: ", oldProjectTitle);
  console.log("Old Project description: ", oldProjectDescription);
  console.log("Old Project color: ", oldProjectColor);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if ( isEditProject && editProject) {
      onEditProject(editProject, projectTitle, oldProjectTitle, projectDescription, projectColor);
    }
    else if ( onCreateProject && createProject ) {
      onCreateProject(createProject, projectTitle, projectDescription, projectColor);
    }
    setProjectTitle('');
    setProjectDescription('');
    setProjectColor('#0057FF'); 
    onHide(); 
  };

  useEffect(() => {
    setProjectTitle(oldProjectTitle);
    setProjectDescription(oldProjectDescription);
    setProjectColor(oldProjectColor || '#0057FF');
  }, [oldProjectTitle, oldProjectDescription, oldProjectColor]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditProject ? `Edit Project ${oldProjectTitle}` : `Create new Project`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="projectTitle">
            <Form.Label>Project Title:</Form.Label>
            <Form.Control
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="projectDescription">
            <Form.Label>Project Description:</Form.Label>
            <Form.Control
              type="text"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="projectColor">
            <Form.Label>Color:</Form.Label>
            <Form.Control
              type="color"
              value={projectColor}
              onChange={(e) => setProjectColor(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            { isEditProject ? 'Edit Project' : 'Create Project' }
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ProjectModal;
