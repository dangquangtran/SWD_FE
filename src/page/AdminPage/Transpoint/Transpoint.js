import React, { useEffect, useState } from "react";
import './Transpoint.scss';
import { getTranPoint, createTranPoint } from "../../../services/userService";
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";
import Button from '@mui/material/Button';

function Transpoint() {
    const [point, setPoint] = useState([]);
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
            showSuccessToast('Your point updated successfully!');
            setEditingPoint(false);
            fetchTranspoint();
            console.log(data)
        } catch (error) {
            showErrorToast('Your point updated error!');
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
                <div className="main-point">
                    <div className="current-point"><b>Điểm giao dịch hiện tại:</b> <span className="point">{point.point}</span></div>
                    <Button variant="outlined" className="button-edit-point" onClick={() => handleEditClick()}>Cập nhật điểm</Button>
                </div>

            </div>

            {editingPoint &&
                <div className="change-point">
                    <label htmlFor="newPointValue"><b>Điểm mới:</b></label>
                    <input placeholder="Nhập điểm mới" id="newPointValue" type="text" value={newPointValue}
                        onChange={(e) => setNewPointValue(e.target.value)} />
                    <Button variant="contained" className="btn-save-point" onClick={() => handleSaveClick(point.point)}>Lưu</Button>
                </div>
            }
        </div>
    );
}

export default Transpoint;
