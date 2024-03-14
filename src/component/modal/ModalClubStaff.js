// ModalClubStaff.js
import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";
import { showErrorToast } from "../toast/toast";
import { getAllSports } from "../../services/userService";
import axios from "axios";


function ModalClubStaff({ isOpen, toggleFromParent, createNewClub, sportName, sportId }) {
    const imageFile = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sportName: sportName,
        image: "",
    });



    useEffect(() => {
        const eventListener = () => {
            setFormData({
                name: "",
                description: "",
                sportName: sportName,
                image: "",
            });
        };

        emitter.on("EVENT_CREATE_MODAL_DATA", eventListener);

        return () => {
            emitter.off("EVENT_CREATE_MODAL_DATA", eventListener);
        };
    }, [sportName]);

    const toggle = () => {
        toggleFromParent();
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
            console.log({ ...formData, sportId: sportId })
            try {
                createNewClub({ ...formData, sportId: sportId });


                setFormData({
                    name: "",
                    description: "",
                    sportName: sportName,
                    image: "",
                });
                toggle();
            } catch (error) {
                showErrorToast("Club added error!");
                console.log(error);
            }
        }
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

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            className={"modal-user-container"}
            size="lg"
        >
            <ModalHeader toggle={toggle}>Tạo mới CLUB</ModalHeader>
            <ModalBody>
                <div className="modal-user-body">
                    <div className="input-container">
                        <label>Tên câu lạc bộ</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, "name")}
                            value={formData.name}
                        />
                    </div>
                    <div className="input-container">
                        <label>Mô tả</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, "description")}
                            value={formData.description}
                        />
                    </div>
                    <div className="input-container">
                        <label>Tên môn thể thao</label>
                        <input type="text" value={formData.sportName} readOnly />

                    </div>
                    <div className="input-container">
                        <label>Hình ảnh</label>
                        <div>
                            <input
                                type="file"
                                ref={imageFile}
                                onChange={(event) => handleOnChangeInput(event, "image")}
                            />
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className="add-btn" onClick={handleAddNewClub}>
                    Tạo mới
                </Button>{" "}
                <Button className="close-btn" onClick={toggle}>
                    Đóng
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalClubStaff;
