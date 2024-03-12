import React, { useEffect, useState } from "react";
import './Transpoint.scss';
import { getTranPoint, createTranPoint } from "../../../services/userService";
import { showSuccessToast } from "../../../component/toast/toast";
import Button from '@mui/material/Button';

function Transpoint() {
    const [point, setPoint] = useState({});
    const [editingPoint, setEditingPoint] = useState(false);
    const [newPointValue, setNewPointValue] = useState('');

    const fetchTranspoint = async () => {
        try {
            const response = await getTranPoint();
            setPoint(response.result);
            console.log(response.result)
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditClick = () => {
        setEditingPoint(!editingPoint);

        console.log(editingPoint)
    };

    const handleSaveClick = async (data) => {
        try {
            await createTranPoint({ point: parseFloat(newPointValue) });
            showSuccessToast('Building added successfully!');
            setEditingPoint(false);
            fetchTranspoint();
            console.log(data)
        } catch (error) {
            showErrorToast('Building added error!');
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTranspoint();

    }, {});

    return (

        <div className="point-container">
            <div key={point.id}>
                <h1>Quản lý điểm</h1>
                <div><b>Mốc điểm:</b> {point.point}</div>
                <div><b>Thời gian thay đổi gần nhất:</b> {point.dateTime}</div>
                <Button variant="outlined" className="button-edit-point" onClick={() => handleEditClick()}>Edit Point</Button>

            </div>

            {editingPoint &&
                <div className="change-point">
                    <label htmlFor="newPointValue"><b>New Point:</b></label>
                    <input id="newPointValue" type="text" value={newPointValue} defaultValue={parseFloat(point.point)} />
                    <Button variant="contained" className="btn-save-point" onClick={() => handleSaveClick(newPointValue)}>Save</Button>
                </div>
            }
        </div>
    );
}

export default Transpoint;
