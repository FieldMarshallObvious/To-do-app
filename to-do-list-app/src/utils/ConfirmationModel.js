import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal({showModal, handleCloseModal, handleDanger, ModelTitle, ModelBody, SecondaryText, DangerText}) {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{ModelTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{ModelBody}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          {SecondaryText}
        </Button>
        <Button variant="danger" onClick={handleDanger}>
          {DangerText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
