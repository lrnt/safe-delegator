import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  Address,
  configureChains,
  createClient,
  useAccount,
  useNetwork,
  WagmiConfig,
} from "wagmi";
import { mainnet, goerli, gnosis } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import SafeList from "components/SafeList";
import Header from "components/Header";
import { ChainId } from "lib/utils";
import { useState } from "react";
import SafeDelegateDetails from "components/SafeDelegateDetails";

const { chains, provider } = configureChains(
  [mainnet, goerli, gnosis],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "Safe Delegator",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  const [currentSafe, setCurrentSafe] = useState<Address | null>(null);
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const chainId = chain ? (chain.id as ChainId) : undefined;
  const isConnected = account && chainId;

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!isConnected && <>Please connect</>}
          {isConnected && !currentSafe && (
            <SafeList
              ownerAddress={account}
              chainId={chainId}
              handleSafeClick={setCurrentSafe}
            />
          )}
          {isConnected && currentSafe && (
            <SafeDelegateDetails
              safeAddress={currentSafe}
              delegatorAddress={account}
              chainId={chainId}
              onClose={() => setCurrentSafe(null)}
            />
          )}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
