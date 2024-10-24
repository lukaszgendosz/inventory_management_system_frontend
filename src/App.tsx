import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import AppRoutes from "./routes/AppRoutes";
import { ConfigProvider, theme } from "antd";
import Navbar from "./components/navbar";
import { useTheme } from "./hooks/useTheme";

const App: React.FC = () => {
  const {themeMode} = useTheme();
  return (
    <ConfigProvider
      theme={{ algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Navbar><AppRoutes /></Navbar>} />
          </Routes>
        </Router>
      </ConfigProvider>
  );
};
export default App;

