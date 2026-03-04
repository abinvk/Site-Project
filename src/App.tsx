import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import Reports from './pages/Reports';
import SubmitReport from './pages/SubmitReport';
import Users from './pages/Users';
import { useStore } from './store';

function App() {
  const currentUser = useStore(state => state.currentUser);

  // Simple role-based guard
  const RequireRole = ({ children, roles }: { children: React.ReactNode, roles: string[] }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (!roles.includes(currentUser.role)) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={
            <RequireRole roles={['admin', 'manager', 'supervisor']}>
              <Dashboard />
            </RequireRole>
          } />

          <Route path="sites" element={
            <RequireRole roles={['admin', 'manager']}>
              <Sites />
            </RequireRole>
          } />

          <Route path="reports" element={
            <RequireRole roles={['admin', 'manager', 'supervisor']}>
              <Reports />
            </RequireRole>
          } />

          <Route path="submit" element={
            <RequireRole roles={['supervisor']}>
              <SubmitReport />
            </RequireRole>
          } />

          <Route path="users" element={
            <RequireRole roles={['admin']}>
              <Users />
            </RequireRole>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
