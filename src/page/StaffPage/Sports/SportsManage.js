import React, { useEffect, useState } from "react";
import { getAllSports } from "../../../services/userService";
import "./SportsManage.scss"


function SportsManageStaff() {
    const [sports, setSport] = useState([]);

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await getAllSports();
                setSport(response.result);
                console.log(response.result)
            } catch (error) {
                console.log(error);
            }
        };

        fetchSports();
    }, []);

    return (
        <div className='sports-table-staff mt-3 mx-2'>
            <table id="sportsTable-staff">
                <tbody>
                    <tr>
                        <th>Sport Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    {
                        sports && sports.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <button className="btn-add-club-staff">Add New Club</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default SportsManageStaff