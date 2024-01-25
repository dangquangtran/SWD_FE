// SportManage.js
import './SportManage.scss';
import { getAllSports, createSport, editSport,deleteSport } from '../../services/userService';
import { useEffect, useState } from 'react';
import ModalSport from '../../component/modal/ModalSport'; 
import { showSuccessToast, showErrorToast } from "../../component/toast/toast";
import ModalEditSport from '../../component/modal/ModalEditSport'; 

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
            showSuccessToast('Sport added successfully!');
            setIsModalOpen(false);
            fetchApiSports();
        } catch (error) {
            showErrorToast('Sport added error!')
            console.log(error);
        }
    }

    const doEditSport = async (editSportId, data) => {
        try {
            await editSport(editSportId, data);
            await fetchApiSports();
        } catch (error) {
            showErrorToast('Sport edit error!')
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
                showSuccessToast('Sport delete successfully!');
                await fetchApiSports();
            }
        } catch (error) {
            showSuccessToast('Sport delete error!');
            console.log(error);
        }
    }

    const handleGetDetail = async (sport) => {
        console.log(sport);
    }

    return (
        <div className='sports-container' style={{ marginTop: '70px' }}>
            <div className='mx-1'>
                <button
                    className='btn btn-primary px-3'
                    onClick={toggleModal}
                >
                    <i className='fa fa-plus'></i>
                    Add new sport
                </button>
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
                                            <button className='btn-edit' onClick={() => handleEdit(item)}><i className='fa fa-pencil'></i></button>
                                            <button className='btn-delete' onClick={() => handleDeleteSport(item)}><i className='fa fa-trash'></i></button>
                                            <button className='btn-detail' onClick={() => handleGetDetail(item)}><i className="fa fa-info-circle"></i></button>
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
