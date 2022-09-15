import {
  useDynamicContext,
  DynamicAuthFlow,
  DynamicContextProvider,
} from '@dynamic-labs/sdk-react';

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
        <DynamicAuthFlow onAuthSuccess={() => window.location.assign('/')} />
      </>
    );
  }

  return (
    <div>
      <button type='button' onClick={() => setShowAuthFlow(true)}>
        Connect With My Wallet
      </button>
      <DynamicAuthFlow onAuthSuccess={() => window.location.assign('/')} />
    </div>
  );
};

const App = () => (
  <DynamicContextProvider
    settings={{
      appLogoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/3/34/Examplelogo.svg',
      appName: 'MultiWallet Demo',
      environmentId: 'ad1fa4f8-5590-4297-90e3-362d86f43230',
      apiBaseUrl: 'http://localhost:3333/api/v0',
      multiWallet: true,
    }}
  >
    <Home />
  </DynamicContextProvider>
);

export default App;
