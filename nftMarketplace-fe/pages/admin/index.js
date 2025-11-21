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

        setNfts721(nfts721Data || []);
        setNfts1155(nfts1155Data || []);
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
            <h2>Overview</h2>
            <div className={Style.statsGrid}>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🎨</div>
                <div className={Style.statContent}>
                  <h3>ERC721 NFTs</h3>
                  <p>{nfts721.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🖼️</div>
                <div className={Style.statContent}>
                  <h3>ERC1155 NFTs</h3>
                  <p>{nfts1155.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🛒</div>
                <div className={Style.statContent}>
                  <h3>Total Transactions</h3>
                  <p>{marketplaceStats.totalCount}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>💸</div>
                <div className={Style.statContent}>
                  <h3>Total Cash Flow</h3>
                  <p>{formatRawValue(marketplaceStats.totalSpent)} WEB</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>👥</div>
                <div className={Style.statContent}>
                  <h3>Users</h3>
                  <p>{users.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🔒</div>
                <div className={Style.statContent}>
                  <h3>Staked NFTs</h3>
                  <p>{stakedNFTs.length}</p>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>💰</div>
                <div className={Style.statContent}>
                  <h3>Listing Price</h3>
                  <p>{listingPrice}</p>
                  <div className={Style.rawValue}>{listingPrice} WEB</div>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>🏆</div>
                <div className={Style.statContent}>
                  <h3>Reward Pool</h3>
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
                  <h3>Transfer Contract</h3>
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
                  <h3>Owner Balance</h3>
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
            <h2>NFT Management</h2>

            <div className={Style.controlSection}>
              <h3>Current Settings</h3>
              <div className={Style.currentSettings}>
                <div className={Style.currentSetting}>
                  <span className={Style.settingLabel}>Listing Price:</span>
                  <span className={Style.settingValue}>
                    {listingPrice}
                    <div className={Style.rawValue}>({listingPrice} WEB)</div>
                  </span>
                </div>
              </div>

              <h3>Update Listing Price</h3>
              <div className={Style.controlGroup}>
                <input
                  type="number"
                  placeholder="New Listing Price (WEB)"
                  value={newListingPrice}
                  onChange={(e) => setNewListingPrice(e.target.value)}
                  className={Style.input}
                />
                <button
                  className={Style.button}
                  onClick={() => updateListingPrice(newListingPrice)}
                >
                  Update Listing Price
                </button>
              </div>
              {newListingPrice && (
                <div className={Style.preview}>
                  <strong>Preview:</strong> Changing from {listingPrice} WEB to{" "}
                  {newListingPrice} WEB
                </div>
              )}
            </div>

            <div className={Style.section}>
              <h3>ERC721 NFTs</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Token ID</th>
                      <th>Seller</th>
                      <th>Price (WEB)</th>
                      <th>Status</th>
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
                            {nft.sold ? "Sold" : "Listed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {nfts721.length === 0 && (
                  <div className={Style.noData}>No ERC721 NFTs found</div>
                )}
              </div>
            </div>

            <div className={Style.section}>
              <h3>ERC1155 NFTs</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Token ID</th>
                      <th>Amount Available</th>
                      <th>Price (WEB)</th>
                      <th>Seller</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nfts1155.map((nft) => (
                      <tr key={nft.itemId}>
                        <td>{nft.itemId}</td>
                        <td>{nft.tokenId}</td>
                        <td>{nft.amountAvailable}</td>
                        <td>{nft.price}</td>
                        <td className={Style.address}>{nft.seller}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {nfts1155.length === 0 && (
                  <div className={Style.noData}>No ERC1155 NFTs found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={Style.tabPanel}>
            <h2>Transactions & History</h2>

            <div className={Style.section}>
              <h3>Web Token Purchases</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Base Coin</th>
                      <th>Base Amount</th>
                      <th>Web Amount</th>
                      <th>Timestamp</th>
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
                  <div className={Style.noData}>No purchase history found</div>
                )}
              </div>
            </div>

            <div className={Style.section}>
              <h3>Fund Transfers</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th>Amount (WEB)</th>
                      <th>Timestamp</th>
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
            <h2>Staking Management</h2>

            <div className={Style.statsCard}>
              <div className={Style.statsHeader}>
                <h3>Current Reward Pool</h3>
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
                  <span>Owner Balance:</span>
                  <span className={Style.balanceAmount}>
                    <TokenAmount amount={ownerBalance} />
                    <div className={Style.rawValue}>
                      {formatRawValue(ownerBalance)} WEB
                    </div>
                  </span>
                </div>
              </div>

              <div className={Style.controlGroup}>
                <input
                  type="number"
                  placeholder="Deposit Amount (WEB)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className={Style.input}
                />
                <button
                  className={Style.button}
                  onClick={() => depositReward(depositAmount)}
                >
                  Deposit Reward
                </button>
              </div>
              {depositAmount && (
                <div className={Style.preview}>
                  <strong>Preview:</strong> Adding {depositAmount} WEB to reward
                  pool ({rewardPool} WEB →{" "}
                  {Number(rewardPool) + Number(depositAmount)} WEB)
                </div>
              )}
            </div>

            <div className={Style.section}>
              <h3>Staked NFTs</h3>
              <div className={Style.tableContainer}>
                <table className={Style.table}>
                  <thead>
                    <tr>
                      <th>Staker</th>
                      <th>Token ID</th>
                      <th>Amount</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Estimated Reward</th>
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
                  <div className={Style.noData}>No staked NFTs found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={Style.tabPanel}>
            <h2>Token Management</h2>

            <div className={Style.balanceSection}>
              <h3>Current Balances</h3>
              <div className={Style.balanceGrid}>
                <div className={Style.balanceCard}>
                  <h4>Owner Wallet</h4>
                  <div className={Style.balanceAmount}>
                    <TokenAmount amount={ownerBalance} />
                  </div>
                  <div className={Style.rawValue}>
                    {formatRawValue(ownerBalance)} WEB
                  </div>
                </div>
                <div className={Style.balanceCard}>
                  <h4>Transfer Contract</h4>
                  <div className={Style.balanceAmount}>
                    <TokenAmount amount={transferBalance} />
                  </div>
                  <div className={Style.rawValue}>
                    {formatRawValue(transferBalance)} WEB
                  </div>
                </div>
                <div className={Style.balanceCard}>
                  <h4>Staking Reward Pool</h4>
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
              <h3>Token Transfers</h3>
              <div className={Style.controlGroup}>
                <input
                  type="number"
                  placeholder="Deposit Token Amount (WEB)"
                  value={tokenDepositAmount}
                  onChange={(e) => setTokenDepositAmount(e.target.value)}
                  className={Style.input}
                />
                <button
                  className={Style.button}
                  onClick={() => depositTokenToTransfer(tokenDepositAmount)}
                >
                  Deposit to Transfer Contract
                </button>
              </div>
              {tokenDepositAmount && (
                <div className={Style.preview}>
                  <strong>Preview:</strong> Transferring {tokenDepositAmount}{" "}
                  WEB from owner ({ownerBalance} WEB) to transfer contract (
                  {transferBalance} WEB)
                </div>
              )}
            </div>

            <div className={Style.controlSection}>
              <h3>Current Base Coin Rates</h3>
              <div className={Style.ratesGrid}>
                {Object.entries(baseRates).map(([coin, rate]) => (
                  <div key={coin} className={Style.rateCard}>
                    <div className={Style.coinName}>{coin}</div>
                    <div className={Style.rateValue}>
                      1 {coin} = {rate} WEB
                    </div>
                    <div className={Style.rawValue}>Rate: {rate}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={Style.controlSection}>
              <h3>Update Base Coin Rates</h3>
              <div className={Style.controlGroup}>
                <input
                  type="text"
                  placeholder="Coin (ETH/BNB/etc)"
                  value={newRateCoin}
                  onChange={(e) => setNewRateCoin(e.target.value)}
                  className={Style.input}
                />
                <input
                  type="number"
                  placeholder="New Rate"
                  value={newRateValue}
                  onChange={(e) => setNewRateValue(e.target.value)}
                  className={Style.input}
                />
                <button
                  className={Style.button}
                  onClick={() => updateBaseCoinRate(newRateCoin, newRateValue)}
                >
                  Update Rate
                </button>
              </div>
              {newRateCoin && newRateValue && (
                <div className={Style.preview}>
                  <strong>Preview:</strong> Changing {newRateCoin} rate from{" "}
                  {baseRates[newRateCoin] || "N/A"} to {newRateValue}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className={Style.tabPanel}>
            <h2>User Management</h2>

            <div className={Style.tableContainer}>
              <table className={Style.table}>
                <thead>
                  <tr>
                    <th>Wallet Address</th>
                    <th>Transactions</th>
                    <th>Total Spent (WEB)</th>
                    <th>Actions</th>
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
                                  (tx) => tx.account === user.address
                                )
                              );
                              setIsModalOpen(true);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className={Style.noData}>
                        No users found
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
            <h2>Overview</h2>
            <div className={Style.noData}>Select a tab to view content</div>
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
        <h1 className={Style.title}>Admin Dashboard</h1>

        <div className={Style.tabContainer}>
          <div className={Style.tabList}>
            {[
              "Dashboard",
              "NFT Management",
              "Transactions",
              "Staking",
              "Token Management",
              "User Management",
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
