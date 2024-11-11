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
import CompanyCreatePage from '../pages/companies/companyCreate';
import CompanyEditPage from '../pages/companies/companyEdit';
import LocationsPage from '../pages/locations/locationsPage';
import LocationCreatePage from '../pages/locations/locationCreate';
import LocationEditPage from '../pages/locations/locationEdit';
import DepartmentsPage from '../pages/departments/departmentsPage';
import DepartmentCreatePage from '../pages/departments/departmentCreate';
import DepartmentEditPage from '../pages/departments/departmentEdit';
import SupplierCreatePage from '../pages/suppliers/supplierCreate';
import SupplierEditPage from '../pages/suppliers/supplierEdit';
import SuppliersPage from '../pages/suppliers/suppliersPage';
import ModelCreatePage from '../pages/models/modelCreate';
import ModelEditPage from '../pages/models/modelEdit';
import ModelsPage from '../pages/models/modelsPage';

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
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/models" element={<ModelsPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[Role.Admin]} />}>
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/users/create" element={<UserCreatePage />} />
          <Route path="/companies/create" element={<CompanyCreatePage />} />
          <Route path="/companies/:id/edit" element={<CompanyEditPage />} />
          <Route path="/locations/create" element={<LocationCreatePage />} />
          <Route path="/locations/:id/edit" element={<LocationEditPage />} />
          <Route path="/departments/create" element={<DepartmentCreatePage />} />
          <Route path="/departments/:id/edit" element={<DepartmentEditPage />} />
          <Route path="/suppliers/create" element={<SupplierCreatePage />} />
          <Route path="/suppliers/:id/edit" element={<SupplierEditPage />} />
          <Route path="/models/create" element={<ModelCreatePage />} />
          <Route path="/models/:id/edit" element={<ModelEditPage />} />
          <Route path="/admin" element={<h1 />} />
        </Route>

        <Route path="*" element={<Navigate to="/me" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
