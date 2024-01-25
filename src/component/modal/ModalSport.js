// ModalSport.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from '../../utils/emitter';
import { showSuccessToast, showErrorToast } from "../toast/toast";

function ModalSport({ isOpen, toggleFromParent, createNewSport }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

    useEffect(() => {
        const eventListener = () => {
        setFormData({
            name: '',
            description: '',
        });
        };
    
        emitter.on('EVENT_CREATE_MODAL_DATA', eventListener);
    
        return () => {
        emitter.off('EVENT_CREATE_MODAL_DATA', eventListener);
        };
  }, []);
  
  

  const toggle = () => {
    toggleFromParent();
  };

  const handleOnChangeInput = (event, id) => {
    setFormData({
      ...formData,
      [id]: event.target.value,
    });
  };

  const checkValidateInput = () => {
    for (const key in formData) {
      if (!formData[key]) {
        showErrorToast(`Missing parameter: ${key}`);
        return false;
      }
    }
    return true;
  };

  const handleAddNewSport = () => {
    let isValid = checkValidateInput()
    if (isValid) {
        createNewSport(formData);
        setFormData({  
          name: '',
          description: '',
        });
        toggle();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className={"modal-user-container"}
      size="lg"
    >
      <ModalHeader toggle={toggle}>
        Create a new sport
      </ModalHeader>
      <ModalBody>
        <div className="modal-user-body">
          <div className="input-container">
            <label>Sport Name</label>
            <input
              type="text"
              onChange={(event) => handleOnChangeInput(event, 'name')}
              value={formData.name}
            />
          </div>
          <div className="input-container">
            <label>Description</label>
            <input
              type="text"
              onChange={(event) => handleOnChangeInput(event, 'description')}
              value={formData.description}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="px-3"
          onClick={handleAddNewSport}
        >
          Add new
        </Button>{" "}
        <Button
          color="secondary"
          className="px-3"
          onClick={toggle}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalSport;
