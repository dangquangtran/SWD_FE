// ModalEditBuilding.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { showSuccessToast, showErrorToast } from "../toast/toast";
import { editBuilding, getAllAreas, getAllSports } from "../../services/userService";

function ModalEditBuilding({ isOpen, toggleFromParent, currentBuilding, editBuilding }) {
    const [areas, setAreas] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        areaName: '',
        areaId: 0,
    });

    useEffect(() => {
        let building = currentBuilding;
        if (building) {
            setFormData({
                name: building.name,
                areaName: building.areaName,
                areaId: building.areaId,
            });
        }
    }, [currentBuilding]);

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

    const handleEditBuilding = async () => {
        console.log(formData)
        if (checkValidateInput()) {
            try {
                // Call API to edit the club
                await editBuilding(currentBuilding.id, formData);
                showSuccessToast('Club updated successfully!');
                editBuilding(currentBuilding.id, formData);
                toggle();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await getAllAreas();
            setAreas(response.result);
            console.log(response.result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAreas()

    }, [])

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            className={"modal-user-container"}
            size="lg"
        >
            <ModalHeader toggle={toggle}>
                Sửa tòa nhà
            </ModalHeader>
            <ModalBody>
                <div className="modal-user-body">
                    <div className="input-container">
                        <label>Tên Tòa nhà</label>
                        <input
                            type="text"
                            onChange={(event) => handleOnChangeInput(event, "name")}
                            value={formData.name}
                        />
                    </div>
                    <div className="input-container">
                        <label>Khu vực</label>
                        <select
                            className="select"
                            onChange={(event) => handleOnChangeInput(event, "areaName")}
                            value={formData.areaName
                            }
                        >
                            <option value="" disabled>
                                Chọn khu vực
                            </option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.name}>
                                    {area.name}
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
                    onClick={handleEditBuilding}
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

export default ModalEditBuilding;
