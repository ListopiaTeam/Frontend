import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./UserContext";
import Events from "./pages/Events.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateList from "./pages/CreateList.jsx";
import Error from "./pages/Error.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import Profile from "./pages/Profile.jsx";

const AppWrapper = () => {
  const location = useLocation();
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    prevLocation.current = location.pathname;
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            location.pathname !== prevLocation.current ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.125 }}
              >
                <App />
              </motion.div>
            ) : (
              <App />
            )
          }
        />
        <Route
          path="/events"
          element={
            location.pathname !== prevLocation.current ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Events />
              </motion.div>
            ) : (
              <Events />
            )
          }
        />
        <Route
          path="/register"
          element={
            location.pathname !== prevLocation.current ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Register />
              </motion.div>
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/login"
          element={
            location.pathname !== prevLocation.current ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Login />
              </motion.div>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/create"
          element={
            location.pathname !== prevLocation.current ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <CreateList />
              </motion.div>
            ) : (
              <CreateList />
            )
          }
        />
        <Route
          path="/*"
          element={
            location.pathname !== prevLocation.current ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Error />
              </motion.div>
            ) : (
              <Error />
            )
          }
        />

        <Route
          path="/profile"
          element={
            location.pathname !== prevLocation.current ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Profile />
              </motion.div>
            ) : (
              <Profile />
            )
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <AppWrapper />
          <ScrollTopButton />
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
