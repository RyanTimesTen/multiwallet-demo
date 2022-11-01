import {
  useDynamicContext,
  DynamicContextProvider,
} from '@dynamic-labs/sdk-react';
import { useEffect } from 'react';

export const shouldLowercaseAddress = (chain: string) =>
  // these are standard from CAIP-2: https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md
  // see also: https://github.com/ChainAgnostic/namespaces
  // note: no standard namespace currently exists for flow
  ['eip155', 'flow', 'evm', 'eth'].includes(chain.toLowerCase());

export const normalizeAddress = (rawAddress: string, chain: string) => {
  const address = shouldLowercaseAddress(chain)
    ? rawAddress.toLowerCase()
    : rawAddress;
  return address;
};

export const isSameAddress = (left: string, right: string, chain: string) =>
  normalizeAddress(left, chain) === normalizeAddress(right, chain);

const Home = () => {
  const {
    user,
    handleLogOut,
    handleUnlinkWallet,
    setShowAuthFlow,
    primaryWallet,
    secondaryWallets,
    setPrimaryWallet,
    multiWalletWidgetState,
    setMultiWalletWidgetState,
  } = useDynamicContext();

  const handleSignMessage = async () => {
    try {
      const signedMessage = await primaryWallet?.connector.signMessage(
        'example',
      );
      alert(signedMessage);
    } catch (e: any) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (multiWalletWidgetState === 'detected_known_secondary_wallet') {
      primaryWallet?.connector.fetchPublicAddress().then((address) => {
        if (!address) {
          return;
        }

        const wallet = secondaryWallets.find((wallet) =>
          isSameAddress(wallet.address, address, wallet.chain),
        );

        if (!wallet) {
          return;
        }

        setMultiWalletWidgetState('idle');
        setPrimaryWallet(wallet.id);
      });
    } else if (multiWalletWidgetState === 'detected_new_wallet') {
      setMultiWalletWidgetState('awaiting_signature');
    }
  }, [
    multiWalletWidgetState,
    primaryWallet?.connector,
    secondaryWallets,
    setMultiWalletWidgetState,
    setPrimaryWallet,
  ]);

  if (user && primaryWallet) {
    return (
      <>
        <div>
          <span>Primary Wallet</span>
          <div>
            {primaryWallet.address} ({primaryWallet.connector.name})
          </div>
          <hr />
          <div>
            <span>Secondary wallets</span>
            {secondaryWallets.map((wallet) => (
              <div key={wallet.address}>
                <span>
                  {wallet.address} ({wallet.connector.name})
                </span>
                <button onClick={() => setPrimaryWallet(wallet.id)}>
                  Set Primary
                </button>
                <button onClick={() => handleUnlinkWallet(wallet.id)}>
                  Unlink
                </button>
              </div>
            ))}
          </div>
          <hr />
          {multiWalletWidgetState === 'awaiting_account_switch' && (
            <p>Switch accounts in your wallet</p>
          )}
          <hr />
          <div>
            <button onClick={handleSignMessage}>Sign Message</button>
          </div>
          <div>
            <button type='button' onClick={() => setShowAuthFlow(true)}>
              Link Wallet
            </button>
          </div>
          <button type='button' onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </>
    );
  }

  return (
    <div>
      <button type='button' onClick={() => setShowAuthFlow(true)}>
        Connect With My Wallet
      </button>
    </div>
  );
};

const App = () => (
  <DynamicContextProvider
    settings={{
      appLogoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/3/34/Examplelogo.svg',
      appName: 'MultiWallet Demo',
      apiBaseUrl: 'http://localhost:3333/api/v0',
      environmentId: '67fa225a-47eb-4ecb-be55-ea74ad01cd3b',
    }}
  >
    <Home />
  </DynamicContextProvider>
);

export default App;
