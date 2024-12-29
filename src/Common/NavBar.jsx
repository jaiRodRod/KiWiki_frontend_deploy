import { Link, useLocation } from 'react-router-dom'; 
import SearchBar from './SearchBar'; 
import Avatar from '@mui/material/Avatar';
import Notification from '../Common/Notification';
import { useNotification } from './NotificationContext';
import GoogleLog from './GoogleLog';
import { useSession } from './SessionProvider';

const Navbar = () => {

  const location = useLocation();
  const shouldShowSearchBar = location.pathname !== "/";

  const { unreadCount } = useNotification();
  const { isLoggedIn } = useSession();

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-amber-950 text-white">
      <div className="flex items-center">
        <Link to="/" className="hover:opacity-80">
            <Avatar sx={{ width: 80, height: 80 }} src='/assets/logo_wiki_blanco.png'/>
        </Link>
      </div>

      <div className="flex-grow flex justify-center mb-2 sm:mb-0">
        {shouldShowSearchBar && <SearchBar />}
      </div>

      <div className="mt-2 sm:mt-0 flex flex-row items-center space-x-4">
        {isLoggedIn && (
          <Link className="row" to="/notifications">
            <Notification unreadCount={unreadCount} />
          </Link>
        )}

        <div className="flex items-center space-x-2">
          <GoogleLog />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
