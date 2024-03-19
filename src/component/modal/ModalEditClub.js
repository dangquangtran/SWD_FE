// ModalEditClub.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from '../../utils/emitter';
import { showSuccessToast, showErrorToast } from "../toast/toast";
import { editClub } from "../../services/userService";

function ModalEditClub({ isOpen, toggleFromParent, currentClub, editClub }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    countMember: 0,
  });

  useEffect(() => {
    let club = currentClub;
    if (club) {
      setFormData({
        name: club.name,
        description: club.description,
        countMember: club.countMember,
      });
    }
  }, [currentClub]);

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
        showErrorToast(`Thiếu: ${key}`);
        return false;
      }
    }
    return true;
  };

  const handleEditClub = async () => {
    if (checkValidateInput()) {
      try {
        // Call API to edit the club
        await editClub(currentClub.id, formData);
        showSuccessToast('Club updated successfully!');
        editClub(currentClub.id, formData);
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
        Sửa club
      </ModalHeader>
      <ModalBody>
        <div className="modal-user-body">
          <div className="input-container">
            <label>Tên câu lạc bộ</label>
            <input
              type="text"
              onChange={(event) => handleOnChangeInput(event, 'name')}
              value={formData.name}
            />
          </div>
          <div className="input-container">
            <label>Mô tả</label>
            <input
              type="text"
              onChange={(event) => handleOnChangeInput(event, 'description')}
              value={formData.description}
            />
          </div>
          <div className="input-container">
            <label>Số lượng thành viên</label>
            <input
              type="number"
              onChange={(event) => handleOnChangeInput(event, 'countMember')}
              value={formData.countMember}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="px-3"
          onClick={handleEditClub}
        >
          Lưu thay đổi
        </Button>{" "}
        <Button
          color="secondary"
          className="px-3"
          onClick={toggle}
        >
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalEditClub;
