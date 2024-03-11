import React, { useEffect, useState } from "react";
import {
  getUserWallet,
  getTransactionHistoryPoints,
} from "../../services/memberService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import "./HistoryPage.scss";

function HistoryPage({ clubDetail }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [transactionHistoryPoints, setTransactionHistoryPoints] = useState([]);
  const [walletInfo, setWalletInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWalletInfo() {
      try {
        const response = await getUserWallet(userInfo.id);
        setWalletInfo(response.result);
        console.log(response.result);
        const walletId = response.result.id;
        const response2 = await getTransactionHistoryPoints(walletId);
        setTransactionHistoryPoints(response2.result);
        const lastTransaction = response2.result.find(
          (item) => item.status && item.status.data && item.status.data[0] === 1
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching wallet info:", error);
        setLoading(false);
      }
    }

    fetchWalletInfo();
  }, []);

  const date = new Date(clubDetail.dateTime);

  const day = date.getDate(); 
  const month = date.getMonth() + 1; 
  const year = date.getFullYear(); 
  const timePost = ` ${day}-${month}-${year}`

  return (
    <div className="history-page-container">
      <div className="club-title-new-feed">
        <img
          className="img-background"
          src={clubDetail.image}
          alt="club-background"
          style={{
            width: "28%",
            "margin-right": "37px",
            "border-radius": "44%",
          }}
        ></img>
        <div>
          <p>{clubDetail.name}</p>
          <p>Số lượng thành viên {clubDetail.countMember}</p>
          <p>Ngày thành lập: {timePost}</p>
        </div>
      </div>
      <h2>Chi tiết về ví của bạn</h2>
      <div className="history-wrapper">
        <div className="wallet-detail-popup">
          <h3>Ví của bạn</h3>
          <p>
            <b>Tên:</b> {walletInfo.memberName}
          </p>
          <p>
            <b>Điểm bạn đang có:</b> {walletInfo.point}{" "}
            <FontAwesomeIcon icon={faStar} className="faStar" />
          </p>
        </div>
        <div className="users-table mt-3 mx-2">
          <table id="customers">
            <tbody>
              <tr>
                <th>Điểm ban đầu</th>
                <th>Điểm giao dịch</th>
                <th>Tổng kết</th>
                <th>Ghi chú</th>
              </tr>
              {transactionHistoryPoints.map((item, index) => {
                if (
                  item.status &&
                  item.status.data &&
                  item.status.data[0] === 1
                ) {
                  const resultPoint = item.initialPoint + item.transactionPoint;
                  const formattedTransactionPoint =
                    item.transactionPoint > 0
                      ? `+${item.transactionPoint}`
                      : item.transactionPoint;
                  return (
                    <tr key={index}>
                      <td>{item.initialPoint}</td>
                      <td>{formattedTransactionPoint}</td>
                      <td>{resultPoint}</td>
                      <td>{item.desciption}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
      {loading && (
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      )}
      {transactionHistoryPoints.length === 0 && !loading && (
        <div className="no-posts-message">Bạn chưa có ví</div>
      )}
    </div>
  );
}

export default HistoryPage;
