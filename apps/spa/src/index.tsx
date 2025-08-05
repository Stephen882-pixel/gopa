import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider } from "@mui/styled-engine";

import AppRouter from "@src/app/router";
import MatXTheme from "@src/components/theme";
import store, { initStore } from "@src/app/redux/store";

import './custom.css';

// The root component
const root = document.getElementById("react-base") as HTMLElement;

// Initialise the redux store before the root component renders
initStore(root);

// Load the root component
ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <MatXTheme>
        <CssBaseline />
        <AppRouter />
      </MatXTheme>
    </StyledEngineProvider>
  </Provider>
);
