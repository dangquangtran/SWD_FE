import React, { useEffect, useState } from "react";
import { getUserWallet, getTransactionHistoryPoints } from "../../services/memberService"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import './HistoryPage.scss';

function HistoryPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [transactionHistoryPoints, setTransactionHistoryPoints] = useState([]);
    const [walletInfo, setWalletInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWalletDetail, setShowWalletDetail] = useState(false);

    useEffect(() => {
        async function fetchWalletInfo() {
            try {
                const response = await getUserWallet(userInfo.id);
                setWalletInfo(response.result);
                const walletId = response.result.id
                const response2 = await getTransactionHistoryPoints(walletId);
                setTransactionHistoryPoints(response2.result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching wallet info:", error);
                setLoading(false);
            }
        }

        fetchWalletInfo();
    }, []);

    const toggleWalletDetail = () => {
        setShowWalletDetail(!showWalletDetail);
    }

    return ( 
        <div>
            <h2>History Page</h2>
            <h2 onClick={toggleWalletDetail} style={{cursor: 'pointer'}}>Detail Wallet</h2>
            {showWalletDetail && (
                <div className="wallet-detail-popup" >
                    <h3>Wallet Information</h3>
                    <p>Tên: {walletInfo.memberName}</p>
                    <p>Điểm bạn đang có: {walletInfo.point}</p>
                </div>
            )}
            {loading ? (
                <div className="loading-spinner">
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
            ) : transactionHistoryPoints.length === 0 ? (
                <div className="no-posts-message">
                    Bạn chưa có ví
                </div>
            ) : (
                <div className='users-table mt-3 mx-2'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Point</th>
                                <th>Transaction Point</th>
                                <th>Result Point</th>
                                <th>Description</th>
                            </tr>
                            {transactionHistoryPoints.map((item, index) => {
                                if (item.status && item.status.data && item.status.data[0] === 1) {
                                    const resultPoint = item.initialPoint + item.transactionPoint;
                                    return (
                                        <tr key={index}>
                                            <td>{item.initialPoint}</td>
                                            <td>{item.transactionPoint}</td>
                                            <td>{resultPoint}</td>
                                            <td>{item.desciption}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HistoryPage;
