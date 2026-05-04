import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/Devices';
import { Automations } from './pages/Automations';
import { Security } from './pages/Security';
import { Appliances } from './pages/Appliances';
import { Statistics } from './pages/Statistics';
import { Users } from './pages/Users';
import { Notifications } from './pages/Notifications';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'devices', Component: Devices },
      { path: 'automations', Component: Automations },
      { path: 'security', Component: Security },
      { path: 'appliances', Component: Appliances },
      { path: 'statistics', Component: Statistics },
      { path: 'users', Component: Users },
      { path: 'notifications', Component: Notifications },
    ],
  },
]);
