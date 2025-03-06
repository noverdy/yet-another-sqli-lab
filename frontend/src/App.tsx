import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import './index.css';
import Register from './pages/auth/register';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import useAuthStore from './stores/authStore';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';

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
          <Route path='/' element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
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
