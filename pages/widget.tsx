import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react';

const WidgetPage = () => {
  return (
    <DynamicContextProvider
      settings={{
        appLogoUrl:
          'https://upload.wikimedia.org/wikipedia/commons/3/34/Examplelogo.svg',
        appName: 'MultiWallet Demo',
        apiBaseUrl: 'http://localhost:3333/api/v0',
        environmentId: '67fa225a-47eb-4ecb-be55-ea74ad01cd3b',
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
