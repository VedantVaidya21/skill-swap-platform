import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Skill Swap
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200 transition-colors">
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/search" className="hover:text-primary-200 transition-colors">
                  Find Skills
                </Link>
                <Link to="/skills" className="hover:text-primary-200 transition-colors">
                  My Skills
                </Link>
                <Link to="/swap-requests" className="hover:text-primary-200 transition-colors">
                  Swap Requests
                </Link>
                <div className="relative group">
                  <button className="flex items-center hover:text-primary-200 transition-colors">
                    <span>{currentUser.username}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-primary-100">
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-primary-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-primary-700 px-4 py-2 rounded-md hover:bg-primary-100 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-600">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="block py-2 hover:bg-primary-600 px-3 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/search"
                    className="block py-2 hover:bg-primary-600 px-3 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Find Skills
                  </Link>
                  <Link
                    to="/skills"
                    className="block py-2 hover:bg-primary-600 px-3 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Skills
                  </Link>
                  <Link
                    to="/swap-requests"
                    className="block py-2 hover:bg-primary-600 px-3 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Swap Requests
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 hover:bg-primary-600 px-3 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-2 hover:bg-primary-600 px-3 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 hover:bg-primary-600 px-3 rounded text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 hover:bg-primary-600 px-3 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 bg-white text-primary-700 px-3 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 