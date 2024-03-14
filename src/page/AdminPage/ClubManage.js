import React, { useEffect, useState } from 'react';
import './ClubManage.scss';
import { getAllClub, createClub, editClub, deleteClub } from '../../services/userService';
import { showSuccessToast, showErrorToast } from "../../component/toast/toast";
import ModalClub from '../../component/modal/ModalClub';
import ModalEditClub from '../../component/modal/ModalEditClub';

function ClubManage() {
    const [clubs, setClubs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [clubEdit, setClubEdit] = useState("");

    useEffect(() => {
        fetchApiClubs();
    }, []);

    const fetchApiClubs = async () => {
        try {
            let data = await getAllClub();
            // console.log(data.result[2].status.data);
            console.log(data);
            setClubs(data.result);
        } catch (error) {
            setClubs([]);
            console.log(error);
        }
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleModalEdit = () => {
        setIsModalEdit(!isModalEdit);
    }

    const doCreateNewClub = async (data) => {
        try {
            await createClub(data);
            showSuccessToast('Club added successfully!');
            setIsModalOpen(false);
            fetchApiClubs();
        } catch (error) {
            showErrorToast('Club added error!');
            console.log(error);
        }
    }


    const doEditClub = async (editClubId, data) => {
        try {
            await editClub(editClubId, data);
            await fetchApiClubs();
        } catch (error) {
            showErrorToast('Club edit error!')
            console.log(error);
        }
    };

    const handleEdit = (club) => {
        setClubEdit(club);
        setIsModalEdit(true);
    };

    const handleDeleteClub = async (club) => {
        try {
            if (club && club.id) {
                await deleteClub(club.id);
                showSuccessToast('Club deleted successfully!');
                await fetchApiClubs();
            }
        } catch (error) {
            showErrorToast('Club delete error!');
            console.log(error);
        }
    }

    return (
        <div className='clubs-container' style={{ marginTop: '70px' }}>
            <div className='mx-1'>
                <button
                    className='btn btn-primary px-3'
                    onClick={toggleModal}
                >
                    <i className='fa fa-plus'></i>
                    Thêm câu lạc bộ
                </button>
            </div>
            <ModalClub
                isOpen={isModalOpen}
                toggleFromParent={toggleModal}
                createNewClub={doCreateNewClub}
            />
            <ModalEditClub
                isOpen={isModalEdit}
                currentClub={clubEdit}
                toggleFromParent={toggleModalEdit}
                editClub={doEditClub}
            />
            <div className='clubs-table mt-3 mx-2'>
                <table id="clubsTable">
                    <tbody>
                        <tr>
                            <th>Tên câu lạc bộ</th>
                            <th>Giới thiệu</th>
                            <th>Số thành viên</th>
                            <th>Người quản lí</th>
                            <th>Hoạt động</th>
                        </tr>
                        {
                            clubs && clubs.map((item, index) => {
                                if (item.status && item.status.data && item.status.data[0] === 1 && item.approveStatus === 1) {
                                    return (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>{item.countMember}</td>
                                            <td>{item.staffName}</td>
                                            <td>
                                                <button className='btn-edit' onClick={() => handleEdit(item)}><i className='fa fa-pencil'></i></button>
                                                <button className='btn-delete' onClick={() => handleDeleteClub(item)}><i className='fa fa-trash'></i></button>
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

export default ClubManage;
