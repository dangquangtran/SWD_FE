import { useState, useEffect } from "react";
import { getAllClub, updateClubApproved, updateClubReject } from '../../services/userService';
import { getAllSports } from '../../services/userService';

import "./Approval.scss"
import { showErrorToast, showSuccessToast } from "../../component/toast/toast";


function ApprovalManage() {
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        fetchApiClubs();
    }, []);

    const fetchApiClubs = async () => {
        try {
            let data = await getAllClub();
            console.log(data.result);
            setClubs(data.result);
        } catch (error) {
            setClubs([]);
            console.log(error);
        }
    }


    const handleApprove = async (clubId) => {
        try {
            await updateClubApproved(clubId);
            showSuccessToast('Chấp thuận thành công')
            await fetchApiClubs()
        } catch (error) {
            showErrorToast('Chấp thuận thất bại')
            console.log(error);
        }
    }
    const handleReject = async (clubId) => {
        try {
            await updateClubReject(clubId);
            showSuccessToast('Từ chối thành công');
            await fetchApiClubs()
        } catch (error) {
            showSuccessToast('Từ chối thất bại')
            console.log(error);
        }
    }

    return (
        <div className="approval-container">
            <div className="club-approve">
                <h2>Bảng phê duyệt câu lạc bộ</h2>
                <div className='sports-table mt-3 mx-2'>
                    <table id="sportsTable">
                        <tbody>
                            <tr>
                                <th>Tên câu lạc bộ</th>
                                <th>Xác nhận</th>
                                <th>Giới thiệu</th>
                            </tr>

                            {
                                clubs && clubs.map((item, index) => {
                                    if (item.status && item.status.data && item.status.data[0] === 1 && item.approveStatus === 0) {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>
                                                    <button 
                                                        className="btn-approve" 
                                                        onClick={() => handleApprove(item.id)}>Phê duyệt
                                                    </button>
                                                    <button 
                                                        className="btn-reject" 
                                                        onClick={() => handleReject(item.id)}>Từ chối
                                                    </button>
                                                </td>
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
