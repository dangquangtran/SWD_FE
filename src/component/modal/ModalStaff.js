import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { showErrorToast } from "../toast/toast";
import axios from "axios";
import { emitter } from "../../utils/emitter";

function ModalStaff({ isOpen, toggleFromParent, createNewStaff }) {
  const imageFile = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    image: "",
  });

  useEffect(() => {
    const eventListener = () => {
      setFormData({
        name: "",
        email: "",
        password: "",
        image: "",
        gender: "",
      });
    };

    emitter.on("EVENT_CREATE_MODAL_DATA", eventListener);

    return () => {
      emitter.off("EVENT_CREATE_MODAL_DATA", eventListener);
    };
  }, []);

  const toggle = () => {
    toggleFromParent();
  };

  const handleOnChangeInput = (event, id) => {
    if (id === "image" && imageFile) {
      uploadCloudinary(imageFile.current?.files[0]);
    }
    setFormData({
      ...formData,
      [id]: event.target.value,
    });
  };

  const uploadCloudinary = async (image) => {
    const formDataImage = new FormData();
    formDataImage.append("api_key", "665652388645534");
    formDataImage.append("upload_preset", "upload-image");
    formDataImage.append("file", image);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/upload-image/image/upload",
        formDataImage
      );
      setTimeout(() => {
        setFormData({
          ...formData,
          image: response.data.url,
        });
      }, 500);
      console.log("Upload cloudinary successfully", response);
    } catch (error) {
      console.log("Error upload cloudinary:", error);
    }
  };

  const checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["name", "email", "password", "image", "gender"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!formData[arrInput[i]]) {
        isValid = false;
        showErrorToast(`Thiếu: ${arrInput[i]}`);
        break;
      }
    }
    return isValid;
  };

  const handleAddNewStaff = () => {
    console.log(formData);
    let isValid = checkValidateInput();
    if (isValid) {
      createNewStaff(formData);
      setFormData({
        name: "",
        email: "",
        password: "",
        image: "",
        gender: "",
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
      <ModalHeader toggle={toggle}>Tạo mới staff</ModalHeader>
      <ModalBody>
        <div className="modal-user-body">
          <div className="input-container">
            <label>Tên tài khoản</label>
            <input
              type="text"
              onChange={(event) => handleOnChangeInput(event, "name")}
              value={formData.name}
            />
          </div>
          <div className="input-container">
            <label>Email</label>
            <input
              type="text"
              onChange={(event) => handleOnChangeInput(event, "email")}
              value={formData.email}
            />
          </div>
          <div className="input-container">
            <label>Mật khẩu</label>
            <input
              type="password"
              onChange={(event) => handleOnChangeInput(event, "password")}
              value={formData.password}
            />
          </div>
          <div className="input-container">
            <label>Hình ảnh</label>
            <input
              type="file"
              ref={imageFile}
              onChange={(event) => handleOnChangeInput(event, "image")}
            />
          </div>
          <div className="input-container">
            <label>Giới tính</label>
            <select
              className="select"
              onChange={(event) => handleOnChangeInput(event, "gender")}
              value={formData.gender}
            >
              <option value="" disabled>
                Lựa chọn giới tính
              </option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddNewStaff}>
          Thêm
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalStaff;
