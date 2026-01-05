import { useLocation, useNavigate } from 'react-router-dom';
import { FiPlus, FiLogOut, FiUser, FiBookOpen } from 'react-icons/fi';

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
        <div className="nav-logo-square">
    <FiBookOpen size={18} />
  </div>
        <h3>NovelReader</h3>
      </div>

      <div className="nav-right-group">
        {session && (
          <>
            <button className="nav-icon-btn" onClick={handleLogout}><FiLogOut size={22}/></button>
            
          </>
        )}
      </div>
    </nav>
  );
};
export default NavbarWrapper;