import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMemberInClub, handleLogoutStaff } from "../../../services/staffService";
import { deleteMember } from "../../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";
import './ClubPageStaff.scss'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";



function ClubPageStaff() {
    const { clubId } = useParams();
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();


    const fetchMembers = async () => {
        try {
            const response = await getMemberInClub(clubId);
            setMembers(response.message);
        } catch (error) {
            console.log(error);
        }
    }
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#92C7CF',
            color: theme.palette.common.back,
            fontSize: 20,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 16,
        },
    }));

    const handleBack = () => {
        window.history.back();
    }
    useEffect(() => {
        fetchMembers();
    }, [clubId]);

    const handleDeleteUser = async (user) => {
        try {
            if (user && user.id) {
                await deleteMember(user.id);
                showSuccessToast('Xóa thành viên thành công');
                fetchMembers();
            }
        } catch (error) {
            showErrorToast('Xóa thành viên thất bại');
            console.log(error);
        }
    }

    const handleLogout = async () => {
        try {
            await handleLogoutStaff();
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='member-list-container-staff' style={{ marginTop: '70px' }}>
            <div className="content-container">
                <div className="header-staff">
                    <Button onClick={handleBack} className="btn-back-staff" variant="contained"><FontAwesomeIcon icon={faBackward} /> Quay lại</Button>

                    <button onClick={handleLogout} className="btn-logout-staff">
                        Đăng xuất{" "}
                        <FontAwesomeIcon
                            className="logout-icon"
                            icon={faArrowRightFromBracket}
                        />
                    </button>
                </div>

            </div>
            <div className="table-container">
                <h1>Danh sách các thành viên trong câu lạc bộ</h1>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell align="center">Tên</StyledTableCell>
                                <StyledTableCell align="center">Giới tính</StyledTableCell>
                                <StyledTableCell align="center">Số điện thoại</StyledTableCell>
                                <StyledTableCell align="center">Ảnh </StyledTableCell>
                                <StyledTableCell align="center">Hành động</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {members && members.map((item, index) => {
                                if (item.status && item.status.data && item.status.data[0] === 1) {
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <StyledTableCell component="th" scope="row">
                                                {item.email}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{item.name}</StyledTableCell>
                                            <StyledTableCell align="center">{item.gender}</StyledTableCell>
                                            <StyledTableCell align="center">{item.phoneNumber}</StyledTableCell>
                                            <StyledTableCell align="center"><img width={50} height={50} src={item.image} /></StyledTableCell>
                                            <StyledTableCell align="center"><button className='btn-delete' onClick={() => handleDeleteUser(item)}><i className='fa fa-trash'></i></button></StyledTableCell>

                                        </TableRow>
                                    )
                                }
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>



    );
}

export default ClubPageStaff;