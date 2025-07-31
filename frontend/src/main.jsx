import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./stores/store.js";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function BetaApp() {

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    // <StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
      </GoogleOAuthProvider>
    // </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<BetaApp />);
export default BetaApp;
