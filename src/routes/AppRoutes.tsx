import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UsersPage from '../pages/users/usersPage';
import UserEditPage from '../pages/users/userEdit';
import RequireAuth from '../utils/RequireAuth';
import PersistLogin from '../utils/PersistLogin';
import { Role } from '../models/user';
import Login from '../pages/login';
import UserDetails from '../pages/users/userDetails';
import CompaniesPage from '../pages/companies/companiesPage';
import UserCreatePage from '../pages/users/userCreate';

const AppRoutes: React.FC = () => {
  return (
    <Routes> 
      <Route path="/login" element={<Login />} />
      
      <Route element={<PersistLogin />}>
    
        <Route element={<RequireAuth allowedRoles={[Role.User, Role.Manager, Role.Admin]} />}>
          <Route path="/me" element={<h1>Me</h1>} />
        </Route>
        
        <Route element={<RequireAuth allowedRoles={[Role.Manager, Role.Admin]} />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/companies" element={<CompaniesPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[Role.Admin]} />}>
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/users/create" element={<UserCreatePage />} />
          <Route path="/admin" element={<h1 />} />
        </Route>

        <Route path="*" element={<Navigate to="/me" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
