import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import './index.css';
import ForgotPassword from './pages/auth/forgot-password';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ResetPassword from './pages/auth/reset-password';
import UserDashboard from './pages/dashboard';
import useAuthStore from './stores/authStore';
import AdminDashboard from './pages/admin/dashboard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path='/auth/register' element={<Register />} />
          <Route path='/auth/login' element={<Login />} />
          <Route path='/auth/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/auth/reset-password/:token'
            element={<ResetPassword />}
          />
        </Route>

        <Route element={<AuthRoute />}>
          <Route path='/' element={<UserDashboard />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AdminRoute() {
  const user = useAuthStore((state) => state.user);
  return user?.isAdmin ? <Outlet /> : <Navigate to='/auth/login' />;
}

function AuthRoute() {
  const user = useAuthStore((state) => state.user);
  return user ? <Outlet /> : <Navigate to='/auth/login' />;
}

function GuestRoute() {
  const user = useAuthStore((state) => state.user);
  return user ? <Navigate to='/' /> : <Outlet />;
}

export default App;
