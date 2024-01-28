import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from '../../utils/emitter'
import { showSuccessToast, showErrorToast } from "../toast/toast";
import { getAllBuildingId } from "../../services/userService";

function ModalMember({ isOpen, toggleFromParent, createNewUser }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        gender: '',
        buildingId: '',
        buildingName: '',
        phoneNumber: ''
    });
    const [buildingIds, setBuildingIds] = useState([]);

    useEffect(() => {
        const fetchBuildingIds = async () => {
            try {
                const response = await getAllBuildingId();
                console.log(response);
                setBuildingIds(response.result);
            } catch (error) {
                console.error('Error fetching buildingIds', error);
            }
        };

        fetchBuildingIds();
    }, []);

    useEffect(() => {
        const eventListener = () => {
            setFormData({
                name: '',
                email: '',
                password: '',
                image: '',
                gender: '',
                buildingId: '',
                buildingName: '',
                phoneNumber: '',
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
        let isValid = true;
        let arrInput = ['name', 'email', 'password', 'image', 'gender', 'buildingId', 'buildingName', 'phoneNumber'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!formData[arrInput[i]]) {
                isValid = false;
                showErrorToast(`Missing parameter: ${arrInput[i]}`);
                break;
            }
        }
        return isValid;
    };

    const handleAddNewUser = () => {
        let isValid = checkValidateInput();
        if (isValid) {
            //call api create modal
            createNewUser(formData);

            setFormData({
                name: '',
                email: '',
                password: '',
                image: '',
                gender: '',
                buildingId: '',
                buildingName: '',
                phoneNumber: '',
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
            <ModalHeader toggle={toggle}>
                CREATE A NEW USER
            </ModalHeader>
            <ModalBody>
                <div className="modal-user-body">
                    <div className="input-container">
                        <label>User Name</label>
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
                        <label>Building Name</label>
                        <select className="select"
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
                        <label>Building Id</label>
                        <select
                            className="select"
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
                    className="add-btn"
                    onClick={handleAddNewUser}
                >
                    Add new
                </Button>{" "}
                <Button
                    className="close-btn"
                    onClick={toggle}
                >
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalMember;