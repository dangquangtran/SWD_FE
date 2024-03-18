import React, { useEffect, useState } from "react";
import './NewFeedStaff.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faSquareMinus, faTrashCan } from "@fortawesome/free-regular-svg-icons";

import Button from '@mui/material/Button';
import { useNavigate, } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteSlotByIdSlot, getSlotByIdClub, getYards } from "../../../services/userService";
import { showErrorToast, showSuccessToast } from "../../../component/toast/toast";
import { handleLogoutStaff } from "../../../services/staffService";


function NewFeedStaff() {
    const navigate = useNavigate();
    const { clubId } = useParams();
    const [postInClub, setPostInClub] = useState([])
    const [yards, setYards] = useState([])
    const [numberOfSlot, setNumberOfSlot] = useState({});
    const [isLoading, setIsLoading] = useState(true);




    const handleBack = () => {
        window.history.back();
    }

    const handleLogout = async () => {
        try {
            await handleLogoutStaff();
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const fetchApiSlot = async () => {
        try {
            const response = await getSlotByIdClub(clubId)
            setPostInClub(response.result)
            console.log(response.result)
        } catch (error) {
            console.log(error);
        }
    }

    const fetchApiSYard = async () => {
        try {
            const response = await getYards()
            setYards(response.result)
            console.log('a' + response.result)
        } catch (error) {
            console.log(error);
        }
    }

    const fetchnumSlot = async () => {
        try {
            const response1 = await getIdMemberCreatePost(userInfo.id, id);
            const memberCreatePostId = response1.result.id;

            const response2 = await getMyPostInClub(memberCreatePostId);
            setMyPostInClub(response2.result);

            const response3Promises = response2.result.map(async (post) => {
                const response = await getListMemberJoinPost(post.id);
                return {
                    postId: post.id,
                    members: response.result,
                    status: response.IdClubMemberSlots,
                };
            });
            const response3Results = await Promise.all(response3Promises);
            setMemberJoinList(response3Results);

            const promises = response2.result.map(async (item) => {
                const response = await getNumberOfSlot(item.id);
                return { itemId: item.id, numberOfSlot: response.result };
            });

            const results = await Promise.all(promises);
            const numberOfSlotMap = {};
            results.forEach((result) => {
                numberOfSlotMap[result.itemId] = result.numberOfSlot;
            });
            setNumberOfSlot(numberOfSlotMap);

            setIsLoading(false)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchApiSlot()
    }, [clubId])

    useEffect(() => {
        fetchApiSYard()
        fetchnumSlot()

    }, [])

    const handleDeletePost = async (slot) => {
        try {
            if (slot && slot.id) {
                console.log(slot)
                await deleteSlotByIdSlot(slot.id);
                showSuccessToast("Xóa slot thành công!");
                await fetchApiSlot()
            }
        } catch (error) {
            showErrorToast("Xóa slot không thành công!");
            console.error(error);
        }
    }

    return (
        <div className="newfeed-staff">

            <div className="content-container-header-staff">
                <Button onClick={handleBack} className="btn-back-staff-nf" variant="contained"><FontAwesomeIcon icon={faBackward} /> Quay lại</Button>
                <h1>
                    Quản lý Bài viết của Câu Lạc Bộ
                </h1>
                <button onClick={handleLogout} className="btn-logout-staff-nf">
                    Đăng xuất{" "}
                    <FontAwesomeIcon
                        className="logout-icon"
                        icon={faArrowRightFromBracket}
                    />
                </button>

            </div>
            <div className="new-feed-container-staff">
                {postInClub && postInClub.map((item, index) => {
                    //Find yard by id
                    const yardDetails = yards.find((yard) => {
                        return yard.id === item.yardId;
                    });

                    //format time 
                    const time = item.date + "T" + item.startTime + ":00";
                    const targetTime = new Date(time).getTime();
                    const currentTime = new Date().getTime();

                    var isPassTime = false;

                    if (targetTime < currentTime) {
                        isPassTime = true;
                    }

                    const date = new Date(item.dateTime);
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const timePost = ` ${hours}:${minutes} ${year}-${month}-${day}`;

                    return (
                        <div className="post-content-container-staff">
                            <img className="post-img" src={item.image} alt="avatar" />
                            <div className="post-infor">
                                <h3>Thông tin trận đấu</h3>
                                <div className="infor-slot">
                                    <div>
                                        <b>
                                            Khu:{" "}
                                        </b>
                                        {yardDetails?.areaName}
                                        {" "}
                                    </div>
                                    <div>
                                        <b>
                                            Sân:
                                        </b>
                                        {yardDetails?.sportName} -  {item.yardName}
                                    </div>
                                    <div>
                                        <b>
                                            Thời gian:
                                        </b>
                                        {item.startTime} - {item.endTime}
                                    </div>
                                    <div>
                                        <b>Ngày: </b> {item.date}
                                    </div>
                                    <div>
                                        <div>
                                            <b>
                                                Tổng số người chơi:{" "}

                                            </b>
                                            {parseInt(item.requiredMember) +
                                                parseInt(item.currentMember)}
                                        </div>
                                        <div>
                                            <b>
                                                Còn:{" "}

                                            </b>
                                            {parseInt(item.requiredMember) -
                                                parseInt(numberOfSlot[item.id] || 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="remove-post" onClick={() => { handleDeletePost(item) }}><FontAwesomeIcon className="icon-trash" icon={faTrashCan} /></div>
                        </div>
                    )
                })}


            </div>
            <button ><FontAwesomeIcon icon={faSquareMinus} /></button>

        </div>
    )
}

export default NewFeedStaff