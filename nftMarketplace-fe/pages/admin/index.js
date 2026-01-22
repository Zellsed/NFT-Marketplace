import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Style from "../../styles/admin.module.css";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import { DeployerAddress } from "../../Context/constant";
import NavBar from "../../Ingredients/components/NavBar/NavBar";
import Footer from "../../Ingredients/components/Footer/Footer";
import Spacer from "../../Ingredients/components/Spacer/Spacer";
import Loader from "../../Ingredients/components/Loader/Loader";
import Modal from "../../Ingredients/components/Modal/Modal";
import TokenAmount, {
  formatRawValue,
} from "../../Ingredients/components/formatTokenAmount/TokenAmount";

const AdminPage = () => {
  const {
    currentAccount,
    checkIfWalletIsConnected,
    fetchNFTs,
    fetchNFTs1155,
    tranferTokenWeb,
    getAllTransactions,
    getAllWebTokenPurchaseHistory,
    checkRewardPool,
    fetchMyStakedNFTs,
    getListingPrice,
    getOwnerTokenBalance,
    getTransferContractBalance,
    getBaseCoinRates,
    getAllUsers,
    getTotalTransactionMarketplaceAll,
    updateListingPrice,
    depositReward,
    depositTokenToTransfer,
    updateBaseCoinRate,
  } = useContext(NFTMarketplaceContext);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserTransactions, setSelectedUserTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nfts721, setNfts721] = useState([]);
  const [nfts1155, setNfts1155] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [marketplaceStats, setMarketplaceStats] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [rewardPool, setRewardPool] = useState(0);
  const [stakedNFTs, setStakedNFTs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newListingPrice, setNewListingPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [tokenDepositAmount, setTokenDepositAmount] = useState("");
  const [newRateCoin, setNewRateCoin] = useState("");
  const [newRateValue, setNewRateValue] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [listingPrice, setListingPrice] = useState("0");
  const [ownerBalance, setOwnerBalance] = useState("0");
  const [transferBalance, setTransferBalance] = useState("0");
  const [baseRates, setBaseRates] = useState({});

  useEffect(() => {
    getAllWebTokenPurchaseHistory();
    getTotalTransactionMarketplaceAll();
  }, []);

  useEffect(() => {
    if (purchaseHistory.length > 0) {
      const uniqueUsers = purchaseHistory.reduce((acc, item) => {
        if (!acc.some((u) => u.address === item.account)) {
          acc.push({
            address: item.account,
            totalCount: item.totalCount || 0,
            totalSpent: item.totalSpent || 0,
          });
        }
        return acc;
      }, []);

      setUsers(uniqueUsers);
    } else {
      setUsers([]);
    }
  }, [purchaseHistory]);

  useEffect(() => {
    if (!currentAccount) return;

    if (currentAccount.toLowerCase() !== DeployerAddress.toLowerCase()) {
      console.log("❌ Not admin");
      router.push("/");
      return;
    }

    const init = async () => {
      try {
        const [
          nfts721Data,
          nfts1155Data,
          txs,
          marketplaceStats,
          history,
          pool,
          staked,
          listPrice,
          ownerBal,
          transferBal,
          rates,
        ] = await Promise.all([
          fetchNFTs(),
          fetchNFTs1155(),
          getAllTransactions(),
          getTotalTransactionMarketplaceAll(),
          getAllUsers(),
          checkRewardPool(),
          fetchMyStakedNFTs(currentAccount),
          getListingPrice(),
          getOwnerTokenBalance(),
          getTransferContractBalance(),
          getBaseCoinRates(),
        ]);

        console.log("nfts721Data", nfts721Data);

        setNfts721(nfts721Data.items || []);
        setNfts1155(nfts1155Data.items || []);
        setTransactions(txs || []);
        setMarketplaceStats({
          totalCount: marketplaceStats.totalCount || 0,
          totalSpent: marketplaceStats.totalSpent || 0,
        });
        setPurchaseHistory(history || []);
        setRewardPool(pool || 0);
        setStakedNFTs(staked || []);
        setListingPrice(listPrice || "0");
        setOwnerBalance(ownerBal);
        setTransferBalance(transferBal);
        setBaseRates(rates);
      } catch (error) {
        console.error("Error initializing admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [currentAccount]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className={Style.tabPanel}>
            <h2>Tổng quan</h2>
            <div className={Style.statsGrid}>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🎨</div>
                <div className={Style.statContent}>
                  <h3>NFT theo tiêu chuẩn ERC-721</h3>
                  <p>{nfts721.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🖼️</div>
                <div className={Style.statContent}>
                  <h3>NFT theo tiêu chuẩn ERC-1155</h3>
                  <p>{nfts1155.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🛒</div>
                <div className={Style.statContent}>
                  <h3>Tổng số giao dịch</h3>
                  <p>{marketplaceStats.totalCount}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>💸</div>
                <div className={Style.statContent}>
                  <h3>Tổng dòng tiền</h3>
                  <p>{formatRawValue(marketplaceStats.totalSpent)} WEB</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>👥</div>
                <div className={Style.statContent}>
                  <h3>Người dùng</h3>
                  <p>{users.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🔒</div>
                <div className={Style.statContent}>
                  <h3>NFT đã đặt cọc</h3>
                  <p>{stakedNFTs.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>💰</div>
                <div className={Style.statContent}>
                  <h3>Giá niêm yết</h3>
                  <p>{listingPrice}</p>
                  <div className={Style.rawValue}>{listingPrice} WEB</div>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🏆</div>
                <div className={Style.statContent}>
                  <h3>Quỹ phần thưởng</h3>
                  <p>
                    <TokenAmount amount={rewardPool} />
                  </p>
                  <div className={Style.rawValue}>
                    {formatRawValue(rewardPool)} WEB
                  </div>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🏦</div>
                <div className={Style.statContent}>
                  <h3>Hợp đồng chuyển giao</h3>
                  <p>
                    <TokenAmount amount={transferBalance} />
                  </p>
                  <div className={Style.rawValue}>
                    {formatRawValue(transferBalance)} WEB
                  </div>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>👑</div>
                <div className={Style.statContent}>
                  <h3>Số dư của chủ sở hữu</h3>
                  <p>
                    <TokenAmount amount={ownerBalance} />
                  </p>
                  <div className={Style.rawValue}>
                    {formatRawValue(ownerBalance)} WEB
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={Style.tabPanel}>
            <h2>Quản lý NFT</h2>

            <div className={Style.controlSection}>
              <h3>Cài đặt hiện tại</h3>
              <div className={Style.currentSettings}>
                <div className={Style.currentSetting}>
                  <span className={Style.settingLabel}>Giá niêm yết:</span>
                  <span className={Style.settingValue}>
                    {listingPrice}
                    <div className={Style.rawValue}>({listingPrice} WEB)</div>
                  </span>
                </div>
              </div>
            </div>

            <div className={Style.section}>
              <h3>NFT theo tiêu chuẩn ERC-721</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Mã Token</th>
                      <th>Người bán</th>
                      <th>Giá (WEB)</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nfts721.map((nft) => (
                      <tr key={nft.tokenId}>
                        <td>{nft.tokenId}</td>
                        <td className={Style.address}>{nft.seller}</td>
                        <td>{nft.price}</td>
                        <td>
                          <span
                            className={
                              nft.sold ? Style.statusSold : Style.statusListed
                            }
                          >
                            {nft.sold ? "Đã bán" : "Đã liệt kê"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {nfts721.length === 0 && (
                  <div className={Style.noData}>
                    Không tìm thấy NFT ERC-721 nào
                  </div>
                )}
              </div>
            </div>

            <div className={Style.section}>
              <h3>NFT theo tiêu chuẩn ERC-1155</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>ID vật phẩm</th>
                      <th>Mã Token</th>
                      <th>Người bán</th>
                      <th>Số lượng khả dụng</th>
                      <th>Giá (WEB)</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nfts1155.map((nft) => (
                      <tr key={nft.itemId}>
                        <td>{nft.itemId}</td>
                        <td>{nft.tokenId}</td>
                        <td className={Style.address}>{nft.seller}</td>
                        <td>{nft.amountAvailable}</td>
                        <td>{nft.price}</td>
                        <td>
                          <span
                            className={
                              nft.sold ? Style.statusSold : Style.statusListed
                            }
                          >
                            {nft.sold ? "Đã bán" : "Đã liệt kê"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {nfts1155.length === 0 && (
                  <div className={Style.noData}>
                    Không tìm thấy NFT ERC-1155 nào
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={Style.tabPanel}>
            <h2>Giao dịch & Lịch sử</h2>

            <div className={Style.section}>
              <h3>Giao dịch mua Token trên web</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Người dùng</th>
                      <th>Đồng coin gốc</th>
                      <th>Số lượng gốc</th>
                      <th>Số lượng (Web)</th>
                      <th>Thời gian ghi nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tranferTokenWeb.map((h) => (
                      <tr key={h.id}>
                        <td className={Style.address}>{h.userAddress}</td>
                        <td>{h.baseCoin}</td>
                        <td>{h.baseCoinAmount}</td>
                        <td>{h.webTokenAmount}</td>
                        <td>{new Date(h.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tranferTokenWeb.length === 0 && (
                  <div className={Style.noData}>
                    Không tìm thấy lịch sử mua hàng
                  </div>
                )}
              </div>
            </div>

            <div className={Style.section}>
              <h3>Chuyển tiền</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Người gửi</th>
                      <th>Người nhận</th>
                      <th>Số lượng (WEB)</th>
                      <th>Thời gian ghi nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={index}>
                        <td className={Style.address}>{tx.sender}</td>
                        <td className={Style.address}>{tx.receiver}</td>
                        <td>{tx.amount}</td>
                        <td>
                          {new Date(tx.timestamp * 1000).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length === 0 && (
                  <div className={Style.noData}>No transactions found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={Style.tabPanel}>
            <h2>Quản lý đặt cọc</h2>

            <div className={Style.statsCard}>
              <div className={Style.statsHeader}>
                <h3>Quỹ phần thưởng hiện tại</h3>
                <div className={Style.rewardAmount}>
                  <p>
                    <TokenAmount amount={rewardPool} />
                  </p>
                  <div className={Style.rawValue}>
                    {formatRawValue(rewardPool)} WEB
                  </div>
                </div>
              </div>

              <div className={Style.balanceInfo}>
                <div className={Style.balanceItem}>
                  <span>Số dư chủ sở hữu:</span>
                  <span className={Style.balanceAmount}>
                    <TokenAmount amount={ownerBalance} />
                    <div className={Style.rawValue}>
                      {formatRawValue(ownerBalance)} WEB
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div className={Style.section}>
              <h3>NFT đã đặt cọc</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Người đặt cọc</th>
                      <th>Mã Token</th>
                      <th>Số lượng</th>
                      <th>Thời gian bắt đầu</th>
                      <th>Thời gian kết thúc</th>
                      <th>Phần thưởng ước tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stakedNFTs.map((stake, index) => (
                      <tr key={index}>
                        <td className={Style.address}>
                          {stake.staker || currentAccount}
                        </td>
                        <td>{stake.tokenId}</td>
                        <td>{stake.amount}</td>
                        <td>
                          {new Date(stake.startTime * 1000).toLocaleString()}
                        </td>
                        <td>
                          {new Date(stake.endTime * 1000).toLocaleString()}
                        </td>
                        <td className={Style.reward}>
                          <TokenAmount amount={stake.estimatedReward} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {stakedNFTs.length === 0 && (
                  <div className={Style.noData}>
                    Không tìm thấy NFT đã đặt cọc nào
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={Style.tabPanel}>
            <h2>Quản lý Token</h2>

            <div className={Style.balanceSection}>
              <h3>Số dư hiện tại</h3>
              <div className={Style.balanceGrid}>
                <div className={Style.balanceCard}>
                  <h4>Ví của chủ sở hữu</h4>
                  <div className={Style.balanceAmount}>
                    <TokenAmount amount={ownerBalance} />
                  </div>
                  <div className={Style.rawValue}>
                    {formatRawValue(ownerBalance)} WEB
                  </div>
                </div>
                <div className={Style.balanceCard}>
                  <h4>Hợp đồng chuyển giao</h4>
                  <div className={Style.balanceAmount}>
                    <TokenAmount amount={transferBalance} />
                  </div>
                  <div className={Style.rawValue}>
                    {formatRawValue(transferBalance)} WEB
                  </div>
                </div>
                <div className={Style.balanceCard}>
                  <h4>Quỹ phần thưởng hiện tại</h4>
                  <div className={Style.balanceAmount}>
                    <TokenAmount amount={rewardPool} />
                  </div>
                  <div className={Style.rawValue}>
                    {formatRawValue(rewardPool)} WEB
                  </div>
                </div>
              </div>
            </div>

            <div className={Style.controlSection}>
              <h3>Tỷ giá coin gốc hiện tại</h3>
              <div className={Style.ratesGrid}>
                {Object.entries(baseRates).map(([coin, rate]) => (
                  <div key={coin} className={Style.rateCard}>
                    <div className={Style.coinName}>{coin}</div>
                    <div className={Style.rateValue}>
                      1 {coin} = {rate} WEB
                    </div>
                    <div className={Style.rawValue}>Tỷ lệ: {rate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className={Style.tabPanel}>
            <h2>Quản lý người dùng</h2>

            <div className={Style.tableContainer}>
              <table className={Style.table}>
                <thead>
                  <tr>
                    <th>Địa chỉ ví</th>
                    <th>Giao dịch</th>
                    <th>Tổng chi tiêu (WEB)</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.address}>
                        <td className={Style.address}>{user.address}</td>
                        <td>{Number(user.totalCount)}</td>
                        <td>{user.totalSpent} WEB</td>
                        <td>
                          <button
                            className={Style.smallButton}
                            onClick={() => {
                              setSelectedUserTransactions(
                                purchaseHistory.filter(
                                  (tx) => tx.account === user.address,
                                ),
                              );
                              setIsModalOpen(true);
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className={Style.noData}>
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className={Style.tabPanel}>
            <h2>Tổng quan</h2>
            <div className={Style.noData}>Chọn một tab để xem nội dung</div>
          </div>
        );
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={Style.adminPage}>
      <NavBar />
      <Spacer />
      <div className={Style.container}>
        <h1 className={Style.title}>Bảng điều khiển quản trị</h1>

        <div className={Style.tabContainer}>
          <div className={Style.tabList}>
            {[
              "Bảng điều khiển",
              "Quản lý NFT",
              "Giao dịch",
              "Đặt cọc",
              "Quản lý Token",
              "Quản lý người dùng",
            ].map((tabName, index) => (
              <button
                key={index}
                className={`${Style.tab} ${
                  activeTab === index ? Style.activeTab : ""
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tabName}
              </button>
            ))}
          </div>

          {renderTabContent()}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userTransactions={selectedUserTransactions}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
