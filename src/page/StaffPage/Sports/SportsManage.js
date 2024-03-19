import React, { useEffect, useState } from "react";
import { getAllSports } from "../../../services/userService";
import "./SportsManage.scss";
import ModalClubStaff from "../../../component/modal/ModalClubStaff";
import { createClubStaff } from "../../../services/staffService";
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { faBorderStyle } from "@fortawesome/free-solid-svg-icons";

function SportsManageStaff() {
    const [sports, setSports] = useState([]);
    const [selectedSportId, setSelectedSportId] = useState(null);

    const openModalForSport = (sportId) => {
        setSelectedSportId(sportId);
    };

    const closeModal = () => {
        setSelectedSportId(null);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#92C7CF',
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await getAllSports();
                setSports(response.result);
                console.log(response.result);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSports();
    }, []);

    const doCreateNewClub = async (data) => {
        try {
            const userID = JSON.parse(localStorage.getItem('userInfo')).id
            await createClubStaff(userID, data);
            console.log(data)
            showSuccessToast('Tạo câu lạc bộ thành công');
            closeModal()
        } catch (error) {
            showErrorToast('Tạo câu lạc bộ thất bại');
            console.log(error);
        }
    }

    return (
        <div className='sports-table-staff mt-3 mx-2'>
            <h1>Danh sách các môn thể thao có thể tạo câu lạc bộ</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Tên môn thể thao</StyledTableCell>
                            <StyledTableCell align="center">Mô tả</StyledTableCell>
                            <StyledTableCell align="center">Hoạt động</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sports.map((item, index) => (
                            <TableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    {item.name}
                                </StyledTableCell>
                                <StyledTableCell align="center">{item.description}</StyledTableCell>
                                <StyledTableCell align="center"><button
                                    className="btn-add-club-staff"
                                    onClick={() => openModalForSport(item.id)}
                                >
                                    Add New Club
                                </button></StyledTableCell>
                                <ModalClubStaff
                                    isOpen={selectedSportId === item.id}
                                    toggleFromParent={closeModal}
                                    sportName={item.name}
                                    sportId={item.id}
                                    createNewClub={doCreateNewClub}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default SportsManageStaff;
