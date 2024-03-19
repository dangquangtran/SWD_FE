import './SportManage.scss';
import { getAllSports, createSport, editSport,deleteSport } from '../../services/userService';
import { useEffect, useState } from 'react';
import ModalSport from '../../component/modal/ModalSport'; 
import { showSuccessToast, showErrorToast } from "../../component/toast/toast";
import ModalEditSport from '../../component/modal/ModalEditSport'; 
import Button from '@mui/material/Button';

function SportManage() {
    const [sports, setSports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [sportEdit, setSportEdit] = useState("");

    useEffect(() => {
        fetchApiSports();
    }, []);

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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleModalEdit = () => {
        setIsModalEdit(!isModalEdit);
    }

    const doCreateNewSport = async (data) => {
        try {
            await createSport(data)
            showSuccessToast('Thêm mới môn thể thao thành công');
            setIsModalOpen(false);
            fetchApiSports();
        } catch (error) {
            showErrorToast('Thêm mới môn thể thao thất bại')
            console.log(error);
        }
    }

    const doEditSport = async (editSportId, data) => {
        try {
            await editSport(editSportId, data);
            showSuccessToast('Cập nhập môn thể thao thành công');
            await fetchApiSports();
        } catch (error) {
            showErrorToast('Cập nhập môn thể thao không thành công')
            console.log(error);
        }
    };

    const handleEdit = (sport) => {
        setSportEdit(sport);
        setIsModalEdit(true);
    };

    const handleDeleteSport = async (sport) => {
        try {
            if (sport && sport.id) {
                await deleteSport(sport.id);
                showSuccessToast('Xóa môn thể thao thành công');
                await fetchApiSports();
            }
        } catch (error) {
            showSuccessToast('Xóa môn thể thao không thành công');
            console.log(error);
        }
    }

    return (
        <div className='sports-container' style={{ marginTop: '70px' }}>
            <div className='mx-1'>
                <Button className="add-Sport" variant="outlined" onClick={toggleModal}><i className='fa fa-plus'></i> Thêm môn thể thao</Button>
            </div>
            <ModalSport
                isOpen={isModalOpen}
                toggleFromParent={toggleModal}
                createNewSport={doCreateNewSport}
            />
            <ModalEditSport
                isOpen={isModalEdit}
                currentSport={sportEdit}
                toggleFromParent={toggleModalEdit}
                editSport={doEditSport}
            />
            <div className='sports-table mt-3 mx-2'>
                <table id="sportsTable">
                    <tbody>
                        <tr>
                            <th>Tên thể thao</th>
                            <th>Giới thiệu</th>
                            <th>Hoạt động</th>
                        </tr>
                        {
                            sports && sports.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => handleEdit(item)}><i className='fa fa-pencil'></i></button>
                                            <button className='btn-delete' onClick={() => handleDeleteSport(item)}><i className='fa fa-trash'></i></button>
                                            {/* <button className='btn-detail' onClick={() => handleGetDetail(item)}><i className="fa fa-info-circle"></i></button> */}
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

export default SportManage;
