import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="my-4">{message}</div>
      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Confirm</Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;