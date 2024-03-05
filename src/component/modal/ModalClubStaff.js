// ModalClubStaff.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";
import { showErrorToast } from "../toast/toast";
import { getAllSports } from "../../services/userService";

function ModalClubStaff({ isOpen, toggleFromParent, createNewClub, sportName, sportId }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        countMember: 0,
        sportName: sportName,
    });
    const [sport, setSport] = useState([]);



    useEffect(() => {
        const eventListener = () => {
            setFormData({
                name: "",
                description: "",
                countMember: 0,
                sportName: sportName,
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
            console.log({ ...formData, sportId: sportId })
            try {
                createNewClub({ ...formData, sportId: sportId });


                setFormData({
                    name: "",
                    description: "",
                    countMember: 0,
                    sportName: sportName,
                });
                toggle();
            } catch (error) {
                showErrorToast("Club added error!");
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
            <ModalHeader toggle={toggle}>CREATE A NEW CLUB</ModalHeader>
            <ModalBody>
                <div className="modal-user-body">
                    <div className="input-container">
                        <label>Club Name</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, "name")}
                            value={formData.name}
                        />
                    </div>
                    <div className="input-container">
                        <label>Description</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, "description")}
                            value={formData.description}
                        />
                    </div>
                    <div className="input-container">
                        <label>Member Count</label>
                        <input
                            type="number"
                            onChange={(event) => handleOnChangeInput(event, "countMember")}
                            value={formData.countMember}
                        />
                    </div>
                    <div className="input-container">
                        <label>Sport Name</label>
                        <input type="text" value={formData.sportName} readOnly />

                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className="add-btn" onClick={handleAddNewClub}>
                    Add new
                </Button>{" "}
                <Button className="close-btn" onClick={toggle}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalClubStaff;
