import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Table from '@mui/material/Table';;
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { getAllSports } from "../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { updateClub } from "../../services/staffService";
import { showErrorToast, showSuccessToast } from "../toast/toast";


function ModalClubInfo({ isOpen, toggleFromParent, data }) {
    const [club, setClub] = useState(null)
    const [isEditing, setIsEditing] = useState(false);
    const [sports, setSport] = useState([]);

    const [formData, setFormData] = useState({

        name: '',
        sportName: '',
        description: '',
    });

    useEffect(() => {
        if (data) {
            setClub(data);
            setFormData({
                name: data.name,
                sportName: data.sportName,
                description: data.description,
            });
        }

    }, [data]);

    useEffect(() => {
        fetchSports();
    }, [])

    const toggle = () => {
        isOpen = false
        toggleFromParent();
        setIsEditing(false);
        setFormData({
            name: '',
            sportName: '',
            description: '',
        })
    };

    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleSaveClick = async () => {

        setIsEditing(false);
        const updatedFormData = {
            ...formData,
            image: club.image,
            sportId: club.sportId,
            staffId: club.staffId,
            status: 1,
            countMember: club.countMember,
            approveStatus: club.approveStatus,
            staffName: club.staffName

        };
        console.log(updatedFormData)

        try {
            // Call API to edit the club
            if (club && club.id) {
                await updateClub(club.id, updatedFormData);
                showSuccessToast('Club updated successfully!');
                toggle();
                setClub(data);
            }
        } catch (error) {
            showErrorToast('Club update error')
            console.log(error);
        }
    }

    const handleOnChangeInput = (event, id) => {
        setFormData({
            ...formData,
            [id]: event.target.value,
        });
    };

    const fetchSports = async () => {
        try {
            const response = await getAllSports();
            setSport(response.result);
            console.log(response.result)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal isOpen={isOpen} className={"modal-user-container"}
            size="lg">
            <ModalHeader toggle={toggle}>
                Thông tin Câu Lạc bộ
            </ModalHeader>
            <ModalBody className="body-info">
                {club &&
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">

                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableHead className="table-head" align="center"><b>Tên câu lạc bộ</b></TableHead>
                                <TableCell align="center">{isEditing ? (
                                    <span>
                                        <TextField value={formData.name} onChange={(event) => handleOnChangeInput(event, "name")} /> <FontAwesomeIcon className="edit-club-staff" icon={faPenToSquare} />
                                    </span>
                                ) : (
                                    club.name
                                )}</TableCell>
                            </TableRow>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableHead className="table-head" align="center"><b>Loại thể thao</b></TableHead>
                                <TableCell align="center">{isEditing ? (
                                    <span>
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
                                        </select> <FontAwesomeIcon className="edit-club-staff" icon={faPenToSquare} />
                                    </span>
                                ) : (
                                    club.sportName
                                )}</TableCell>
                            </TableRow>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableHead className="table-head" align="center"><b>Số lượng thành viên</b></TableHead>
                                <TableCell align="center">{club.countMember}</TableCell>
                            </TableRow>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableHead className="table-head" align="center"><b>Mô tả</b></TableHead>
                                <TableCell align="center">{isEditing ? (
                                    <span>
                                        <TextField value={formData.description} onChange={(event) => handleOnChangeInput(event, "description")} /> <FontAwesomeIcon className="edit-club-staff" icon={faPenToSquare} />

                                    </span>
                                ) : (
                                    club.description
                                )}</TableCell>
                            </TableRow>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableHead className="table-head" align="center"><b>Quản lý bởi Staff</b></TableHead>
                                <TableCell align="center">{club.staffName}</TableCell>
                            </TableRow>
                        </Table>
                    </TableContainer>
                }
            </ModalBody>
            <ModalFooter>
                {isEditing ? (
                    <Button variant="contained" className="btn-update-club" onClick={() => {
                        handleSaveClick()
                    }}>
                        Lưu
                    </Button>
                ) : (
                    <Button variant="contained" className="btn-update-club" onClick={handleEditClick}>
                        Sửa
                    </Button>
                )}
                <Button
                    className="close-btn"
                    onClick={toggle}
                >
                    Hủy
                </Button>
            </ModalFooter>

        </Modal>
    )
}

export default ModalClubInfo