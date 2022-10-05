import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react';

const WidgetPage = () => {
  return (
    <DynamicContextProvider
      settings={{
        appLogoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/3/34/Examplelogo.svg',
        appName: 'MultiWallet Demo',
        apiBaseUrl: 'http://localhost:3333/api/v0',
        environmentId: '9c112252-d39a-4abd-93b9-4e164d8aa750',
        multiWallet: true,
      }}
    >
      <div
        style={{
          float: 'right',
          height: '100vh',
        }}
      >
        <DynamicWidget />
      </div>
    </DynamicContextProvider>
  );
};

export default WidgetPage;
