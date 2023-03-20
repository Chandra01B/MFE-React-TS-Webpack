import { Box, Center, Flex, Heading, Spinner, Image, Link, Text } from "@chakra-ui/react";
import React from "react";
const version = require("../package.json").version;

// const CounterAppOne = React.lazy(() => import("app1/CounterAppOne"));
// const CounterAppTwo = React.lazy(() => import("app2/CounterAppTwo"));

function loadComponent(scope:any, module:any) {
  return async () => {
    await __webpack_init_sharing__("default");
    const container = window[scope] as any;
    await container.init(__webpack_share_scopes__.default);
    const factory = await (window[scope] as any).get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args:any) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement("script");

    element.src = args.url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

function System(props:any) {
  const { ready, failed } = useDynamicScript({
    url: props.system && props.system.url,
  });

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.system.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>;
  }

  const Component = React.lazy(loadComponent(props.system.scope, props.system.module));

  return (
    <React.Suspense fallback="Loading System">
      <Component />
    </React.Suspense>
  );
}

const App = () => (
  <>
    <Center height="100vh" width="100%" backgroundColor="#1B1A29" margin="0" p="0" flexDirection="column">
      <Box color="#fff" position="fixed" right="0" top="0" mr="2rem" mt="2rem">
        Latest Build Date: <Text fontWeight="bold">{version}</Text>
      </Box>
      <Flex border="1px solid #151421" borderRadius="1rem" height="50vh" justifyContent="space-around" alignItems="center" flexDirection="column" padding="5rem" backgroundColor="#6F60EA">
        <Heading color="#fff">CONTAINER</Heading>
        <Flex direction="row" justifyContent="space-around">
          <React.Suspense fallback={<Spinner size="xl" />}>
            <Box p="2rem" mr="2rem" border="1px solid #aeaeae" borderRadius="1rem" backgroundColor="#fff">
              <Heading color="#6F60EA" mb="1rem">
                APP-1
              </Heading>
                <System
                  system={{
                    url: "http://localhost:3001/remoteEntry.js",
                    scope: "app1",
                    module: "./CounterAppOne",
                  }}
                />              
            </Box>
          </React.Suspense>
          <React.Suspense fallback={<Spinner size="xl" />}>
            <Box p="2rem" border="1px solid #aeaeae" borderRadius="1rem" backgroundColor="#fff">
              <Heading color="#6F60EA" mb="1rem">
                APP-2
              </Heading>
              <System
                  system={{
                    url: "http://localhost:3002/remoteEntry.js",
                    scope: "app2",
                    module: "./CounterAppTwo",
                  }}
                />
            </Box>
          </React.Suspense>
        </Flex>
      </Flex>
      <Link marginTop="5rem" href="https://github.com/ogzhanolguncu/react-typescript-module-federation" target="_blank">
        <Image src="./git.png" height="45px" width="45px" />
      </Link>
    </Center>
  </>
);

export default App;
