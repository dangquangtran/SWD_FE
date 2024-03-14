import './MemberManage.scss';
import { getAllMembers, createMember, editMember, deleteMember } from '../../services/userService';
import { useEffect, useState } from 'react';
import ModalMember from '../../component/modal/ModalMember';
import { showSuccessToast, showErrorToast } from "../../component/toast/toast";
import ModalEditMember from '../../component/modal/ModalEditMember';

function MemberManage() {
    const [memBers, setMemBers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalEdit, setIsModalEdit] = useState(false)
    const [memberEdit, setMemberEdit] = useState("")

    useEffect(() => {
        fetchApiMembers()
    }, [])

    const fetchApiMembers = async () => {
        try {
            let data = await getAllMembers()
            console.log(data);
            setMemBers(data.result)
        } catch (error) {
            setMemBers([])
            console.log(error);
        }
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    
    const toggleModalEdit = () => {
        setIsModalEdit(!isModalEdit)
    }

    const doCreateNewUser = async (data) => {
        try {
            await createMember(data)
            showSuccessToast('User added successfully!');
            setIsModalOpen(false)
            fetchApiMembers();
        } catch (error) {
            console.log(error);
        }
    }


    const doEditUser = async (editMemberId, data) => {
        try {
            await editMember(editMemberId, data);
            await fetchApiMembers()
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (user) => {
        setMemberEdit(user);
        setIsModalEdit(true);
    };

    const handleDeleteUser = async (user) => {
        try {
            if(user && user.id) {
                await deleteMember(user.id);
                showSuccessToast('Member deleted successfully!');
                await fetchApiMembers();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='users-container' style={{ marginTop: '70px' }}>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3'
                        onClick={toggleModal}
                    >
                        <i className='fa fa-plus'></i>
                        Thêm thành viên
                    </button>
                </div>
                <ModalMember 
                    isOpen={isModalOpen}
                    toggleFromParent={toggleModal}
                    createNewUser={doCreateNewUser}
                />
                <ModalEditMember 
                    isOpen={isModalEdit}
                    currentUser={memberEdit}
                    toggleFromParent={toggleModalEdit}
                    editUser={doEditUser}
                />
                <div className='users-table mt-3 mx-2'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Giới tính</th>
                                <th>Hình ảnh</th>
                                <th>Tòa</th>
                                <th>Số điện thoại</th>
                                <th>Hoạt động</th>
                            </tr>
                            {
                                memBers && memBers.map((item, index) => {
                                    if (item.status && item.status.data && item.status.data[0] === 1) {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.gender}</td>
                                                <td><img width={50} height={50} src={item.image}/></td>
                                                <td>{item.buildingName}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>
                                                    <button className='btn-edit' onClick={() => handleEdit(item)}><i className='fa fa-pencil'></i></button>
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

export default MemberManage;