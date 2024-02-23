import React, { useEffect, useState } from "react";
import { getUserWallet, getTransactionHistoryPoints } from "../../services/memberService"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import './HistoryPage.scss';

function HistoryPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [transactionHistoryPoints, setTransactionHistoryPoints] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWalletInfo() {
            try {
                const response = await getUserWallet(userInfo.id);
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

    return ( 
        <div>
            <h2>History Page</h2>
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
            ) : transactionHistoryPoints ? (
                <div>
                    <p>Date: {transactionHistoryPoints.dateTime}</p>
                    <p>Initial Point: {transactionHistoryPoints.initialPoint}</p>
                    <p>Transaction Point: {transactionHistoryPoints.transactionPoint}</p>
                </div>
            ) : (
                <p>No wallet information available.</p>
            )}
        </div>
    );
}

export default HistoryPage;