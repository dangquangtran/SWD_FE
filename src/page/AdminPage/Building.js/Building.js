import './Building.scss'
import { getAllBuildings } from "../../../services/userService";
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Building() {
    const [buildings, setBuildings] = useState([])


    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await getAllBuildings();
                setBuildings(response.result);
                console.log(response.result);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBuildings();
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#04AA6D',
            color: theme.palette.common.white,
            border: '1px solid #dddddd',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: '1px solid #dddddd',
        },
    }));
    return (
        <div className="building-container">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Thời gian </StyledTableCell>
                            <StyledTableCell align="center">Khu vực</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buildings.map((item, index) => {
                            if (item.status.data[0] === 1) {
                                return (
                                    <TableRow key={index}>
                                        <StyledTableCell component="th" scope="row">
                                            {item.dateTIme}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{item.name}</StyledTableCell>


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