import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navibar.css';
import { useState, useEffect } from 'react';
import { isAuthenticated, isAdmin, logout } from '../services/UserService';

const Navibar = () => {
  const [menu, setMenu] = useState("Home");
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check auth status whenever location changes
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = () => {
    const authStatus = isAuthenticated();
    const adminStatus = isAdmin();
    setIsUserAuthenticated(authStatus);
    setIsUserAdmin(adminStatus);
  };

  const handleLogout = () => {
    logout();
    setIsUserAuthenticated(false);
    setIsUserAdmin(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // Set active menu based on current path
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path === '') {
      setMenu('Home');
    } else if (path.startsWith('admin/user-management')) {
      setMenu('User Management');
    } else if (path === 'FirmwareManager') {
      setMenu('FirmwareManager');
    } else {
      setMenu(path);
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setIsMobileMenuOpen(false);
  };

  const NavLinks = ({ onClick = () => {} }) => (
    <>
      <li onClick={() => onClick("Home")}>
        <Link to='/'>Home</Link>
        {menu === "Home" && <hr />}
      </li>

      <li onClick={() => onClick("Products")}>
        <Link to='/Products'>Products</Link>
        {menu === "Products" && <hr />}
      </li>

      <li onClick={() => onClick("Repair")}>
        <Link to='/Repair'>Repair</Link>
        {menu === "Repair" && <hr />}
      </li>

      <li onClick={() => onClick("FirmwareManager")}>
        <Link to='/FirmwareManager'>Firmware</Link>
        {menu === "FirmwareManager" && <hr />}
      </li>

      <li onClick={() => onClick("FAQ")}>
        <Link to='/FAQ'>FAQ</Link>
        {menu === "FAQ" && <hr />}
      </li>

      <li onClick={() => onClick("About Us")}>
        <Link to='/Aboutus'>About Us</Link>
        {menu === "About Us" && <hr />}
      </li>

      {isUserAdmin && (
        <li onClick={() => onClick("User Management")}>
          <Link to='/admin/user-management'>Users</Link>
          {menu === "User Management" && <hr />}
        </li>
      )}
    </>
  );

  const AuthButtons = ({ onButtonClick = () => {} }) => (
    <>
      {isUserAuthenticated ? (
        <>
          <Link to='/profile' className="profile-link">
            <button className="profile-button" onClick={onButtonClick}>Profile</button>
          </Link>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <Link to='/login'>
          <button className="login-button" onClick={onButtonClick}>Login</button>
        </Link>
      )}
    </>
  );

  return (
    <div className='Navibar'>
      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        ☰
      </button>

      <div className="nav-logo">
        <Link to="/" className="website-name">CIRO</Link>
      </div>

      {/* Desktop Navigation */}
      <ul className="nav-menu desktop-nav">
        <NavLinks onClick={setMenu} />
      </ul>

      <div className="nav-login-cart desktop-nav">
        <AuthButtons />
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
      
      <div className={`mobile-menu-container ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="nav-logo">
          <Link to="/" className="website-name" onClick={() => setIsMobileMenuOpen(false)}>CIRO</Link>
        </div>
        <ul className="nav-menu">
          <NavLinks onClick={handleMenuClick} />
        </ul>

        <div className="nav-login-cart">
          <AuthButtons onButtonClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Navibar;
