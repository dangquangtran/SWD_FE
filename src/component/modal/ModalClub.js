// ModalClub.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from '../../utils/emitter';
import { showSuccessToast, showErrorToast } from "../toast/toast";
import { getAllSports } from "../../services/userService";

function ModalClub({ isOpen, toggleFromParent, createNewClub }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    countMember: 0,
    sportName: '',
    sportId: '',
  });
  const [sport, setSport] = useState([])

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getAllSports()
        setSport(response.result)
      } catch (error) {
        console.log(error);
      }
    };

    fetchSports();
  }, [])

  useEffect(() => {
    const eventListener = () => {
      setFormData({
        name: '',
        description: '',
        countMember: 0,
        sportName: '',
      sportId: '',
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

  const handleAddNewClub = async () => {
    if (checkValidateInput()) {
      try {
        createNewClub(formData);
        setFormData({
          name: '',
          description: '',
          countMember: 0,
          sportName: '',
          sportId: '',
        });
        toggle();
      } catch (error) {
        showErrorToast('Club added error!');
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
        Create a new club
      </ModalHeader>
      <ModalBody>
        <div className="modal-user-body">
          <div className="input-container">
            <label>Club Name</label>
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
          <div className="input-container">
            <label>Member Count</label>
            <input
              type="number"
              onChange={(event) => handleOnChangeInput(event, 'countMember')}
              value={formData.countMember}
            />
          </div>
          <div className="input-container">
                        <label>Sport Name</label>
                        <select
                            onChange={(event) => handleOnChangeInput(event, 'sportName')}
                            value={formData.sportName}
                        >
                            <option value="" disabled>Select Sport Name</option>
                            {sport.map((sport) => (
                                <option key={sport.id} value={sport.name}>
                                    {sport.name}
                                </option>
                            ))} 
                        </select>
                    </div>
                    <div className="input-container">
                        <label>Sport Id</label>
                        <select
                            onChange={(event) => handleOnChangeInput(event, 'sportId')}
                            value={formData.sportId}
                        >
                            <option value="" disabled>Select Sport Id</option>
                            {sport.map((sport) => (
                                <option key={sport.id} value={sport.id}>
                                    {sport.id}
                                </option>
                            ))}
                        </select>
                    </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="px-3"
          onClick={handleAddNewClub}
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

export default ModalClub;
