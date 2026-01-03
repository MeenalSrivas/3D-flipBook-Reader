import { useLocation, useNavigate } from 'react-router-dom';
import { FiPlus, FiLogOut, FiUser } from 'react-icons/fi';

const NavbarWrapper = ({ session, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check: Kya hum abhi reader page par hain?
  const isReaderPage = location.pathname.includes('/reader');

  // Agar reader page hai, toh hum 'null' return karenge 
  // Isse navbar poori tarah khali ho jayegi
  if (isReaderPage) return null;

  return (
    <nav className="navbar">
      

      <div className="nav-logo" onClick={() => navigate('/')}>
        <h3>NovelReader</h3>
      </div>

      <div className="nav-right-group">
        {session && (
          <>
            <button className="nav-icon-btn" onClick={handleLogout}><FiLogOut size={22}/></button>
            <button className="nav-icon-btn"><FiUser size={24}/></button>
          </>
        )}
      </div>
    </nav>
  );
};
export default NavbarWrapper;