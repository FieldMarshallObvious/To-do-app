import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function TaskModal({ show, onHide, onCreateTask, projects, currentProject, createTask }) {
  const [taskName, setTaskName] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskColor, setTaskColor] = useState('#0057FF'); // Default color
  const [projectTitle, setProjectTitle] = useState(currentProject);

  // You would call this function when the modal's form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submit action
    console.log("TaskModal handleSubmit", taskName, taskColor, projectTitle, taskDueDate);
    onCreateTask(createTask, taskName, taskColor, projectTitle, taskDueDate);
    // Reset State
    setTaskName('');
    setTaskDueDate('');
    setTaskColor('#0057FF'); 
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
              as="select"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            >
              {projects.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="taskName">
            <Form.Label>Task Name:</Form.Label>
            <Form.Control
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="taskDueDate">
            <Form.Label>Due Date:</Form.Label>
            <Form.Control
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="taskColor">
            <Form.Label>Color:</Form.Label>
            <Form.Control
              type="color"
              value={taskColor}
              onChange={(e) => setTaskColor(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Task
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TaskModal;
