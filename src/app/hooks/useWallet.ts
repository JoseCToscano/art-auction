import {
  isConnected,
  getAddress, // getPublicKey (legacy)
  getNetwork,
  isAllowed,
  setAllowed,
  signTransaction,
} from "@stellar/freighter-api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { Networks } from "@stellar/stellar-sdk";

export const useWallet = () => {
  const [hasFreighter, setHasFreighter] = useState<boolean>(false);
  const [isFreighterAllowed, setIsFreighterAllowed] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string>();
  const [network, setNetwork] = useState<string>();

  // Fetch data from account
  const { data: account, isLoading } = api.stellar.getAccount.useQuery(
    publicKey!,
    {
      enabled: !!publicKey, // Only fetch data if publicKey is available
    },
  );

  useEffect(() => {
    // Data fetcher function
    function fetchFreighterData() {
      // Check if user has freighter installed
      isConnected()
        .then(({ isConnected }) => {
          setHasFreighter(isConnected);
          // Request access if not already allowed
          isAllowed()
            .then(({ isAllowed }) => {
              setIsFreighterAllowed(isAllowed);
              if (isAllowed) {
                // Fetch network
                getNetwork()
                  .then(({ network }) => setNetwork(network))
                  .catch(() => toast.error("Error fetching network"));
                // Fetch public key
                getAddress()
                  .then(({ address }) => setPublicKey(address))
                  .catch(() => toast.error("Error fetching public key"));
              }
            })
            .catch(() => toast.error("Error requesting access"));
        })
        .catch(() => toast.error("Error checking connection"));
    }

    // Fetch data on mount
    fetchFreighterData();

    // Poll for changes on Freighter Wallet (e.g. change of network)
    const interval = setInterval(fetchFreighterData, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  function connectWallet() {
    // Prompt to Request access
    setAllowed()
      .then(({ isAllowed }) => {
        setIsFreighterAllowed(isAllowed);
        if (isAllowed) {
          // Fetch network
          getNetwork()
            .then(({ network }) => setNetwork(network))
            .catch(() => toast.error("Error fetching network"));
          // Fetch public key
          getAddress()
            .then(({ address }) => setPublicKey(address))
            .catch(() => toast.error("Error fetching public key"));
        }
      })
      .catch(() => toast.error("Error requesting access"));
  }

  function signXDR(xdr: string) {
    if (!hasFreighter) {
      return toast.error("Freighter not installed");
    }
    if (!isFreighterAllowed) {
      setAllowed()
        .then(({ isAllowed }) => {
          setIsFreighterAllowed(isAllowed);
        })
        .catch(() => toast.error("Error requesting access"));
    }
    if (!publicKey) {
      return toast.error("Wallet not connected");
    }

    return signTransaction(xdr, {
      networkPassphrase: Networks.TESTNET,
      address: publicKey,
    });
  }

  return {
    publicKey,
    network,
    hasFreighter,
    isFreighterAllowed,
    account,
    isLoading,
    connectWallet,
    signXDR,
  };
};
