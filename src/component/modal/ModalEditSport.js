// ModalEditSport.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from '../../utils/emitter';
import { showSuccessToast, showErrorToast } from "../toast/toast";
import { editSport } from "../../services/userService";

function ModalEditSport({ isOpen, toggleFromParent, currentSport, editSport }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    let sport = currentSport;
    if (sport) {
      setFormData({
        name: sport.name,
        description: sport.description,
      });
    }
  }, [currentSport]);

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

  const handleEditSport = async () => {
    if (checkValidateInput()) {
      try {
        // Call API to edit the sport
        await editSport(currentSport.id, formData);
        showSuccessToast('Sport updated successfully!');
        editSport(currentSport.id, formData);
        toggle();
      } catch (error) {
        console.log(error);
      }
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
        Edit sport
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
          onClick={handleEditSport}
        >
          Save change
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

export default ModalEditSport;
