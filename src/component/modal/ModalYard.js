import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from '../../utils/emitter';
import { showErrorToast } from "../toast/toast";
import { getAllAreas, getAllSports } from "../../services/userService";

function ModalYard({ isOpen, toggleFromParent, createNewArea }) {
    const [areas, setAreas] = useState([])
    const [sports, setSport] = useState([]);



    const [formData, setFormData] = useState({
        name: '',
        areaName: '',
        sportName: '',
        areaId: 0,
        sportId: 0
    });

    const toggle = () => {
        toggleFromParent();
    };

    const handleOnChangeInput = (event, id) => {
        if (id === 'sportName') {
            const selectedSport = sports.find(sport => sport.name === event.target.value);
            setFormData({
                ...formData,
                sportId: selectedSport ? selectedSport.id : '',
                [id]: event.target.value,
            });
        } else if (id === 'areaName') {
            const selectedArea = areas.find(area => area.name === event.target.value);
            setFormData({
                ...formData,
                areaId: selectedArea ? selectedArea.id : '',
                [id]: event.target.value,
            });
        } else {
            setFormData({
                ...formData,
                [id]: event.target.value,
            });
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

    const checkValidateInput = () => {
        for (const key in formData) {
            if (!formData[key]) {
                showErrorToast(`Thiếu: ${key}`);
                return false;
            }
        }
        return true;
    };

    const handleAddNewYard = async () => {
        console.log(formData)
        if (checkValidateInput()) {
            try {
                createNewArea(formData);
                setFormData({
                    name: '',
                    areaName: '',
                    sportName: '',
                    areaId: 0,
                    sportId: 0
                });
                toggle();
            } catch (error) {
                showErrorToast("Club added error!");
                console.log(error);
            }
        }
    };

    useEffect(() => {
        const eventListener = () => {
            setFormData({
                name: '',
                areaName: '',
                sportName: '',
                areaId: 0,
                sportId: 0

            });
        };

        emitter.on("EVENT_CREATE_MODAL_DATA", eventListener);

        return () => {
            emitter.off("EVENT_CREATE_MODAL_DATA", eventListener);
        };
    }, []);

    return (
        <Modal isOpen={isOpen} toggle={toggle} className={"modal-user-container"}
            size="lg">
            <ModalHeader toggle={toggle}>
                Tạo mới Sân
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
                    className="add-btn"
                    onClick={handleAddNewYard}
                >
                    Tạo mới
                </Button>{" "}
                <Button
                    className="close-btn"
                    onClick={toggle}
                >
                    Đóng
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalYard;
