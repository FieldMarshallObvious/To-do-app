import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ProjectModal({ show, onHide, onCreateProject, createProject }) {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription,  setProjectDescription] = useState('');
  const [projectColor, setProjectColor] = useState('#0057FF'); // Default color

  // You would call this function when the modal's form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submit action
    onCreateProject(createProject, projectTitle, projectDescription, projectColor);
    // Reset State
    setProjectTitle('');
    setProjectDescription('');
    setProjectColor('#0057FF'); 
    onHide(); // Hide the modal
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
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
            Create Project 
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ProjectModal;
