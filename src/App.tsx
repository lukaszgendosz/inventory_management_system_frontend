import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Users from "./pages/users";
import { Role } from "./models/user";
import RequireAuth from "./utils/RequireAuth";
import PersistLogin from "./utils/PersistLogin";
import Navbar from "./components/navbar";
import UserTable from "./components/userTable";

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
        </Routes>
          <Navbar>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PersistLogin/>}>
                <Route element={<RequireAuth allowedRoles={[Role.User, Role.Manager, Role.Admin]} />}>
                  <Route path="/me" element={< h1/>} />
                </Route>

                <Route element={<RequireAuth allowedRoles={[Role.Manager, Role.Admin]} />}>
                  <Route path="/users" element={<UserTable />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={[Role.Admin]} />}>
                  <Route path="/admin" element={< h1 />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
              </Route>
          </Routes>
          </Navbar>
      </Router>
  );
};
export default App;

