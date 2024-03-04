import React, { useEffect, useState } from "react";
import { getAllSports } from "../../../services/userService";
import "./SportsManage.scss";
import ModalClubStaff from "../../../component/modal/ModalClubStaff";
import { createClubStaff } from "../../../services/staffService";
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";

function SportsManageStaff() {
    const [sports, setSports] = useState([]);
    const [selectedSportId, setSelectedSportId] = useState(null);

    const openModalForSport = (sportId) => {
        setSelectedSportId(sportId);
    };

    const closeModal = () => {
        setSelectedSportId(null);
    };

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await getAllSports();
                setSports(response.result);
                console.log(response.result);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSports();
    }, []);

    const doCreateNewClub = async (data) => {
        try {
            await createClubStaff(data);
            console.log(data)
            showSuccessToast('Club added successfully!');
            closeModal()
        } catch (error) {
            showErrorToast('Club added error!');
            console.log(error);
        }
    }

    return (
        <div className='sports-table-staff mt-3 mx-2'>
            <table id="sportsTable-staff">
                <tbody>
                    <tr>
                        <th>Sport Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    {sports.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                                <button
                                    className="btn-add-club-staff"
                                    onClick={() => openModalForSport(item.id)}
                                >
                                    Add New Club
                                </button>
                            </td>
                            <ModalClubStaff
                                isOpen={selectedSportId === item.id}
                                toggleFromParent={closeModal}
                                sportName={item.name}
                                sportId={item.id}
                                createNewClub={doCreateNewClub}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SportsManageStaff;
