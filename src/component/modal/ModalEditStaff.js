import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ModalEditStaff({ isOpen, toggleFromParent, currentStaff, editStaff }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    image: '',
  });

  useEffect(() => {
    if (currentStaff) {
      setFormData({
        name: currentStaff.name,
        email: currentStaff.email,
        gender: currentStaff.gender,
        image: currentStaff.image,
      });
    }
  }, [currentStaff]);

  const toggle = () => {
    toggleFromParent();
  };

  const handleEditStaff = () => {
    editStaff(currentStaff.id, formData);
    toggle();
  };

  const handleOnChangeInput = (event, id) => {
    setFormData({
      ...formData,
      [id]: event.target.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => toggle()}
      className={"modal-user-container"}
      size="lg"
    >
      <ModalHeader toggle={() => toggle()}>Edit staff</ModalHeader>
      <ModalBody>
      <div className="modal-user-body">
                <div className="input-container">
                        <label>Tên</label>
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
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            onChange={(event) => handleOnChangeInput(event, 'password')}
                            value={formData.password}
                        />
                    </div>
                    <div className="input-container">
                        <label>Hình ảnh</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'image')}
                            value={formData.image}
                        />
                    </div>
                    <div className="input-container">
                        <label>Giới tính</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, 'gender')}
                            value={formData.gender}
                        />
                    </div>
                </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleEditStaff}>Save changes</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalEditStaff;
