import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UserTable from '../components/userTable';
import RequireAuth from '../utils/RequireAuth';
import PersistLogin from '../utils/PersistLogin';
import { Role } from '../models/user';
import Login from '../pages/login';

const AppRoutes: React.FC = () => {
  return (
    <Routes> 
      <Route path="/login" element={<Login />} />
      
      <Route element={<PersistLogin />}>
    
        <Route element={<RequireAuth allowedRoles={[Role.User, Role.Manager, Role.Admin]} />}>
          <Route path="/me" element={<h1>Me</h1>} />
        </Route>
        
        <Route element={<RequireAuth allowedRoles={[Role.Manager, Role.Admin]} />}>
          <Route path="/users" element={<UserTable />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[Role.Admin]} />}>
          <Route path="/admin" element={<h1 />} />
        </Route>

        <Route path="*" element={<Navigate to="/me" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
