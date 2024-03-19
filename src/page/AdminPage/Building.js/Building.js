import './Building.scss'
import { createBuilding, deleteBuilding, editBuilding, getAllBuildings } from "../../../services/userService";
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { showErrorToast, showSuccessToast } from '../../../component/toast/toast';
import ModalAddBuilding from '../../../component/modal/ModalAddBuilding';
import ModalEditBuilding from '../../../component/modal/ModalEditBuilding';

function Building() {
    const [buildings, setBuildings] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [buildingEdit, setBuildingEdit] = useState("");

    const fetchBuildings = async () => {
        try {
            const response = await getAllBuildings();
            setBuildings(response.result);
            console.log(response.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBuildings();
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme, index }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#04AA6D',
            color: theme.palette.common.white,
            border: '1px solid #dddddd',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: '1px solid #dddddd',
            backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white',

        }
    }));
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const doCreateNewBuilding = async (data) => {
        try {
            await createBuilding(data);
            showSuccessToast('Thêm mới tòa nhà thành công');
            setIsModalOpen(false);
            fetchBuildings();
            console.log(data)
        } catch (error) {
            showErrorToast('Thêm mới tòa nhà thất bại!');
            console.log(error);
        }
    }

    const toggleModalEdit = () => {
        setIsModalEdit(!isModalEdit);
    }

    const handleEditBuiling = (building) => {
        setBuildingEdit(building);
        setIsModalEdit(true);
    };
    const doEditBuilding = async (editBuildingId, data) => {
        try {
            await editBuilding(editBuildingId, data);
            showSuccessToast("Cập nhập tòa nhà thành công")
            await fetchBuildings();
        } catch (error) {
            showErrorToast('Cập nhập tòa nhà thất bại')
            console.log(error);
        }
    };

    const handleDeleteBuilding = async (building) => {
        try {
            if (building && building.id) {
                await deleteBuilding(building.id);
                showSuccessToast('Xóa tòa nhà thành công');
                console.log(building)
                await fetchBuildings();
            }
        } catch (error) {
            showErrorToast('Xóa tòa nhà không thành công');
            console.log(error);
        }
    }

    return (
        <div className="building-container">
            <Button className="add-Building" variant="outlined" onClick={toggleModal}><i className='fa fa-plus'></i> Thêm Tòa Nhà</Button>

            <ModalAddBuilding
                isOpen={isModalOpen}
                toggleFromParent={toggleModal}
                createNewArea={doCreateNewBuilding}
            />
            <ModalEditBuilding
                isOpen={isModalEdit}
                currentBuilding={buildingEdit}
                toggleFromParent={toggleModalEdit}
                editBuilding={doEditBuilding}
            />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Thời gian </StyledTableCell>
                            <StyledTableCell>Khu vực </StyledTableCell>
                            <StyledTableCell align="center">Tòa nhà</StyledTableCell>
                            <StyledTableCell align="center">Hoạt động</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buildings.map((item, index) => {
                            const date = new Date(item.dateTIme);
                            const day = date.getDate();
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();
                            const hour = date.getHours()
                            const minute = date.getMinutes()
                            const timePost = `  ${day}-${month}-${year} ${hour}h${minute}`;
                            if (item.status.data[0] === 1) {
                                return (
                                    <TableRow key={index} >
                                        <StyledTableCell index={index} component="th" scope="row">
                                            {timePost}
                                        </StyledTableCell>
                                        <StyledTableCell index={index} align="center">{item.areaName}</StyledTableCell>
                                        <StyledTableCell index={index} align="center">{item.name}</StyledTableCell>
                                        <StyledTableCell index={index} align="center">
                                            <button className="btn-delete" onClick={() => { handleDeleteBuilding(item) }}><i className='fa fa-trash'></i></button>
                                            <button className="btn-edit" onClick={() => handleEditBuiling(item)}><i className='fa fa-pencil'></i></button>
                                        </StyledTableCell>


                                    </TableRow>
                                )
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Building