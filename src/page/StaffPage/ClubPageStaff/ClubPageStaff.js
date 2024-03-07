import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMemberInClub } from "../../../services/staffService"; 
import { deleteMember } from "../../../services/userService";
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";

function ClubPageStaff() {
    const { clubId  } = useParams();
    const [members, setMembers] = useState([]);

    const fetchMembers = async () => {
        try {
            const response = await getMemberInClub(clubId);
            setMembers(response.message);
        } catch (error) {
            console.log(error);
        }
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
    
    return ( 
        <div className='users-container' style={{ marginTop: '70px' }}>
                <div className='users-table mt-3 mx-2'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>Tên</th>
                                <th>Giới tính</th>
                                <th>Số điện thoại</th>
                                <th>Ảnh</th>
                                <th>Hành động</th>
                            </tr>
                            {
                                members && members.map((item, index) => {
                                    if (item.status && item.status.data && item.status.data[0] === 1) {
                                        return (
                                            <tr key={index}>
                                                <td>{item.email}</td>
                                                <td>{item.name}</td>
                                                <td>{item.gender}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td><img width={50} height={50} src={item.image}/></td>
                                                <td>
                                                    <button className='btn-delete' onClick={() => handleDeleteUser(item)}><i className='fa fa-trash'></i></button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })
                            } 
                        </tbody>
                    </table>
                </div>
        </div>
    );
}

export default ClubPageStaff;