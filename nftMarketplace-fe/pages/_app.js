import { useEffect } from "react";
import "../styles/globals.css";
import NavBar from "../Ingredients/components/NavBar/NavBar";
import { Footer } from "../Ingredients/components/componentsindex";
import Spacer from "../Ingredients/components/Spacer/Spacer";
import { NFTMarketplaceProvider } from "../Context/NFTMarketplaceContext";

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountChange = () => {
        localStorage.removeItem("access_token");

        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountChange);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      };
    }
  }, []);

  return (
    <NFTMarketplaceProvider>
      <NavBar />
      <Spacer />
      <Component {...pageProps} />
      <Footer />
    </NFTMarketplaceProvider>
  );
};

export default MyApp;
