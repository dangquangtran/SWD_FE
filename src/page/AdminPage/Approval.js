import { useState, useEffect } from "react";
import { getAllClub } from '../../services/userService';
import { getAllSports } from '../../services/userService';

import "./Approval.scss"


function ApprovalManage() {
    const [clubs, setClubs] = useState([]);
    const [sports, setSports] = useState([]);

    useEffect(() => {
        fetchApiClubs();
        fetchApiSports()
    }, []);

    const fetchApiClubs = async () => {
        try {
            let data = await getAllClub();
            setClubs(data.result);
        } catch (error) {
            setClubs([]);
            console.log(error);
        }
    }

    const fetchApiSports = async () => {
        try {
            let data = await getAllSports();
            console.log(data);
            setSports(data.result);
        } catch (error) {
            setSports([]);
            console.log(error);
        }
    }

    const handleApprove = () => {

    }

    return (
        <div className="approval-container">
            <div className="club-approve">
                <h2>Club approval table</h2>
                <div className='sports-table mt-3 mx-2'>
                    <table id="sportsTable">
                        <tbody>
                            <tr>
                                <th>Club Name</th>
                                <th>Approve</th>
                                <th>Reject</th>
                                <th>Description</th>
                            </tr>

                            {
                                clubs && clubs.map((item, index) => {
                                    if (item.status && item.status.data && item.status.data[0] === 1) {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td><button className="btn-approve" onClick={() => handleApprove(item)}>Approve</button></td>
                                                <td><button className="btn-reject">Reject</button></td>
                                                <td>{item.description}</td>
                                            </tr>
                                        )
                                    }
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>

            <div className="sport-approve">
                <h2>Sport approval table</h2>
                <div className='sports-table mt-3 mx-2'>
                    <table id="sportsTable">
                        <tbody>
                            <tr>
                                <th>Sport Name</th>
                                <th>Approve</th>
                                <th>Reject</th>
                                <th>Description</th>
                            </tr>

                            {
                                sports && sports.map((item, index) => {
                                    if (item.status && item.status.data && item.status.data[0] === 1) {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td><button className="btn-approve" onClick={() => handleApprove(item)}>Approve</button></td>
                                                <td><button className="btn-reject">Reject</button></td>
                                                <td>{item.description}</td>
                                            </tr>
                                        )
                                    }
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ApprovalManage;
