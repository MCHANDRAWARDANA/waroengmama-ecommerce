import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import router from "./routes/AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
