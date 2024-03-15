import React, { useEffect, useState } from "react";
import './Yard.scss';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createYard, deleteYard, editYard, getAllYards } from "../../../services/userService";
import Button from '@mui/material/Button';
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";
import ModalEditYard from "../../../component/modal/ModalEditYard";
import ModalYard from "../../../component/modal/ModalYard";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Yard() {
    const [yards, setYards] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [yardEdit, setYardEdit] = useState("");
    const [filter, setFilter] = useState({ sportName: "" });

    useEffect(() => {
        fetchYards();
    }, []);

    useEffect(() => {
        fetchYards(filter);
    }, [filter]);

    const fetchYards = async (filter = {}) => {
        try {
            let data;
            let applyFilter = false;
    
            for (const key in filter) {
                if (filter[key]) {
                  applyFilter = true;
                  break;
                }
            }
    
            if (!applyFilter) {
                data = await getAllYards();
                console.log('1',data);
            } else {
                data = await getAllYards(filter);
                console.log(data);
            }
    
            setYards(data.result);
        } catch (error) {
            setYards([]);
            console.error(error);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

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

        },
    }));

    const doCreateNewClub = async (data) => {
        try {
            await createYard(data);
            showSuccessToast('Yard added successfully!');
            setIsModalOpen(false);
            fetchYards();
        } catch (error) {
            showErrorToast('Yard added error!');
            console.log(error);
        }
    }

    const handleDeleteYard = async (yard) => {
        try {
            if (yard && yard.id) {
                await deleteYard(yard.id);
                showSuccessToast('yard deleted successfully!');
                console.log(yard)
                await fetchYards();
            }
        } catch (error) {
            showErrorToast('Yard delete error!');
            console.log(error);
        }
    }
    const toggleModalEdit = () => {
        setIsModalEdit(!isModalEdit);
    }

    const handleEditYard = (yard) => {
        setYardEdit(yard);
        setIsModalEdit(true);
    };

    const doEditYard = async (editYardId, data) => {
        try {
            await editYard(editYardId, data);
            await fetchYards();
        } catch (error) {
            showErrorToast('Chỉnh sửa thất bại')
            console.log(error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value }); 
    };

    return (
        <div className="yard-container">
            <Button className="add-yard" variant="outlined" onClick={toggleModal}><i className='fa fa-plus'></i> Thêm sân</Button>
            <ModalYard
                isOpen={isModalOpen}
                toggleFromParent={toggleModal}
                createNewArea={doCreateNewClub}
            />
            <ModalEditYard
                isOpen={isModalEdit}
                currentYard={yardEdit}
                toggleFromParent={toggleModalEdit}
                editYard={doEditYard}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ marginLeft: "auto", marginRight: "auto", display: "flex", alignItems: "center", gap: '10px' }}>Môn thể thao
                                <FormControl variant="standard" sx={{ minWidth: 0 }} >
                                <InputLabel id="sport-filter-label"></InputLabel>
                                <Select
                                    labelId="sport-filter-label"
                                    id="sport-filter"
                                    name="sportName"
                                    value={filter.sportName || ""}
                                    onChange={handleFilterChange}
                                    label="Môn thể thao"
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="Bóng đá">Bóng đá</MenuItem>
                                    <MenuItem value="Cầu lông">Cầu Lông</MenuItem>
                                    <MenuItem value="Tennis">Tennis</MenuItem>
                                </Select>
                            </FormControl></div>
                            </StyledTableCell>
                            <StyledTableCell align="center">Khu vực</StyledTableCell>
                            <StyledTableCell align="center">Sân</StyledTableCell>
                            <StyledTableCell align="center">Hoạt động</StyledTableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {yards.map((item, index) => {
                            if (item.status.data[0] === 1 && item.sportName === filter.sportName || filter.sportName === "") {
                                return (
                                    <TableRow key={index}>
                                        <StyledTableCell index={index} component="th" scope="row">
                                            {item.sportName}
                                        </StyledTableCell>
                                        <StyledTableCell index={index} align="center">{item.areaName}</StyledTableCell>
                                        <StyledTableCell index={index} align="center">{item.name}</StyledTableCell>
                                        <StyledTableCell index={index} align="center">
                                            <button className="btn-delete" onClick={() => { handleDeleteYard(item) }}><i className='fa fa-trash'></i></button>
                                            <button className="btn-edit" onClick={() => handleEditYard(item)}><i className='fa fa-pencil'></i></button>
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

export default Yard