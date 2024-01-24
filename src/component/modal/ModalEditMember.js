// ModalEditMember.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
import { showSuccessToast, showErrorToast } from "../toast/toast";
import { getAllBuildingId } from "../../services/userService";

function ModalEditMember({ isOpen, toggleFromParent, currentUser, editUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
    gender: '',
    buildingId: '',
    buildingName: '',
    phoneNumber: '',
  });

  const [buildingIds, setBuildingIds] = useState([]);

  useEffect(() => {
    const fetchBuildingIds = async () => {
        try {
            const response = await getAllBuildingId();
            setBuildingIds(response.result); 
            console.log(buildingIds);
        } catch (error) {
            console.error('Error fetching buildingIds', error);
        }
    };

    fetchBuildingIds();
}, []);

  useEffect(() => {
    let user = currentUser;
    if (user && !_.isEmpty(user)) {
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.image,
        gender: user.gender,
        buildingId: user.buildingId,
        buildingName: user.buildingName,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [currentUser]);

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
        showErrorToast(`Missing parameter! ${key}`);
        return false;
      }
    }
    return true;
  };

  const handleEditUser = async () => {
    if (checkValidateInput()) {
      await editUser(currentUser.id, formData);
      toggle();
      showSuccessToast('User updated successfully!')
    }
  };

  

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => toggle()}
      className={"modal-user-container"}
      size="lg"
    >
      <ModalHeader toggle={() => toggle()}>
        Edit user
      </ModalHeader>
      <ModalBody>
      <div className="modal-user-body">
                <div className="input-container">
                        <label>Name</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'name')}
                            value={formData.name}
                        />
                    </div>
                    <div className="input-container">
                        <label>Email</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'email')}
                            value={formData.email}
                        />
                    </div>
                    <div className="input-container">
                        <label>Password</label>
                        <input
                            type="password"
                            onChange={(event) => handleOnChangeInput(event, 'password')}
                            value={formData.password}
                        />
                    </div>
                    <div className="input-container">
                        <label>Image</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'image')}
                            value={formData.image}
                        />
                    </div>
                    <div className="input-container">
                        <label>Gender</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'gender')}
                            value={formData.gender}
                        />
                    </div>
                    <div className="input-container">
                        <label>Building Id</label>
                        <select
                            onChange={(event) => handleOnChangeInput(event, 'buildingId')}
                            value={formData.buildingId}
                        >
                            <option value="" disabled>Select Building Id</option>
                            {buildingIds.map((buildingId) => (
                                <option key={buildingId.id} value={buildingId.id}>
                                    {buildingId.id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label>Building Name</label>
                        {/* <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'buildingName')}
                            value={formData.buildingName}
                        /> */}
                        <select
                            onChange={(event) => handleOnChangeInput(event, 'buildingName')}
                            value={formData.buildingName}
                        >
                            <option value="" disabled>Select Building Name</option>
                            {buildingIds.map((buildingId) => (
                                <option key={buildingId.id} value={buildingId.name}>
                                    {buildingId.name}
                                </option>
                            ))} 
                        </select>
                    </div>
                    <div className="input-container">
                        <label>Phone number</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'phoneNumber')}
                            value={formData.phoneNumber}
                        />
                    </div>
                </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="px-3"
          onClick={handleEditUser}

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

export default ModalEditMember;
