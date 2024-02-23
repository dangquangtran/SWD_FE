import React, { useEffect, useState } from "react";
import { getUserWallet } from "../../services/memberService"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import './WalletPage.scss';

function WalletPage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [walletInfo, setWalletInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWalletInfo() {
            try {
                const response = await getUserWallet(userInfo.id);
                setWalletInfo(response.result);
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
            <h2>Wallet Page</h2>
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
            ) : walletInfo ? (
                <div>
                    <p>Name: {walletInfo.memberName}</p>
                    <p>Point: {walletInfo.point}</p>
                </div>
            ) : (
                <p>No wallet information available.</p>
            )}
        </div>
    );
}

export default WalletPage;