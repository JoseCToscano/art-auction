import { useState } from "react";

export const useWallet = () => {
  const [hasFreigherInstalled, setHasFreigherInstalled] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // TODO: Fetch wallet data

  return {
    hasFreigherInstalled,
    publicKey,
  };
};
