import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Skill Swap</h2>
            <p className="text-gray-400">
              Connect with others to exchange skills and knowledge. Teach what you know, learn what you don't.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">
                  Find Skills
                </Link>
              </li>
              <li>
                <Link to="/skills" className="text-gray-400 hover:text-white transition-colors">
                  My Skills
                </Link>
              </li>
              <li>
                <Link to="/swap-requests" className="text-gray-400 hover:text-white transition-colors">
                  Swap Requests
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 mb-2">
              Have questions or suggestions?
            </p>
            <a href="mailto:contact@skillswap.com" className="text-primary-400 hover:text-primary-300 transition-colors">
              contact@skillswap.com
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Skill Swap Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 