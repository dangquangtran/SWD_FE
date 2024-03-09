// ModalEditYard.js
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { showSuccessToast, showErrorToast } from "../toast/toast";
import { getAllAreas, getAllSports } from "../../services/userService";

function ModalEditYard({ isOpen, toggleFromParent, currentYard, editYard }) {
    const [areas, setAreas] = useState([])
    const [sports, setSport] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        areaName: '',
        sportName: '',
        areaId: 0,
        sportId: 0
    });

    useEffect(() => {
        let yard = currentYard;
        if (yard) {
            setFormData({
                name: yard.name,
                areaName: yard.areaName,
                sportName: yard.sportName,
                areaId: yard.areaId,
                sportId: yard.sportId
            });
        }
    }, [currentYard]);

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

    const handleEditYard = async () => {

        if (checkValidateInput()) {
            try {
                // Call API to edit the club
                await editYard(currentYard.id, formData);
                showSuccessToast('Club updated successfully!');
                editYard(currentYard.id, formData);
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

    const fetchSports = async () => {
        try {
            const response = await getAllSports();
            setSport(response.result);
            console.log(response.result)
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchAreas()
        fetchSports();

    }, [])

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
                        <label>Tên sân</label>
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
                    <div className="input-container">
                        <label>Môn thể thao</label>
                        <select
                            className="select"
                            onChange={(event) => handleOnChangeInput(event, "sportName")}
                            value={formData.sportName}
                        >
                            <option value="" disabled>
                                Chọn Môn thể thao
                            </option>
                            {sports.map((sport) => (
                                <option key={sport.id} value={sport.name}>
                                    {sport.name}
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
                    onClick={handleEditYard}
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

export default ModalEditYard;
