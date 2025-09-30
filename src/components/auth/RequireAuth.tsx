import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import wsService from '../../utils/websocket';

const selectUser = (state: any) => state.user.user;

export default function RequireAuth({ children }: { children: React.ReactElement }) {
  const user = useSelector(selectUser);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // Connect WebSocket when user is authenticated
      wsService.connect();
    } else {
      // Disconnect WebSocket when user is not authenticated
      wsService.disconnect();
    }
  }, [user]);

  if (!user) {
    // Redirect to /auth but remember where user wanted to go
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}
