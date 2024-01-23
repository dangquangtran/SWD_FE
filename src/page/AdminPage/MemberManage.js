import './MemberManage.scss';
import { getAllMembers, createMember } from '../../services/userService';
import { useEffect, useState } from 'react';
import ModalMember from '../../component/modal/ModalMember';
import { ToastContainer, toast } from 'react-toastify';

function MemberManage() {
    const [memBers, setMemBers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const userInfo = localStorage.getItem('userInfo');

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const doCreateNewUser = async (data) => {
        try {
            await createMember(data)
            toast.success('User added successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsModalOpen(false)
            fetchApiMembers();
        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <div className='users-container'>
                <div className='title text-center'>Manage members with {userInfo}</div>
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
                                                <button className='btn-edit' onClick={() => this.handleEitUser(item)}><i className='fa fa-pencil'></i></button>
                                                <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i className='fa fa-trash'></i></button>
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