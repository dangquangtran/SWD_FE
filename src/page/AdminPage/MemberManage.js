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
                await fetchApiMembers();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetDetail = async (user) => {
        console.log(user);
    }

    return (
        <div className='users-container' style={{ marginTop: '70px' }}>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3'
                        onClick={toggleModal}
                    >
                        <i className='fa fa-plus'></i>
                        Add new user
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
                                <th>Email</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Building name</th>
                                <th>Phone number</th>
                                <th>Action</th>
                            </tr>
                            {
                                memBers && memBers.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.name}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.buildingName}</td>
                                            <td>{item.phoneNumber}</td>
                                            <td>
                                                <button className='btn-edit' onClick={() => handleEdit(item)}><i className='fa fa-pencil'></i></button>
                                                <button className='btn-delete' onClick={() => handleDeleteUser(item)}><i className='fa fa-trash'></i></button>
                                                <button className='btn-detail' onClick={() => handleGetDetail(item)}><i className="fa fa-user-o"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            } 
                        </tbody>
                    </table>
                </div>
            </div>
     );
}

export default MemberManage;