import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Get current user's name from localStorage
    if (isAuthenticated) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const { name } = JSON.parse(currentUser);
        setUserName(name);
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Clear user data
    setUserName('');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col pb-4 bg-white">
      <div className="flex flex-col justify-center items-end px-16 py-3 w-full text-xs bg-white text-zinc-800 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 items-center max-sm:flex-wrap max-sm:justify-end">
          <Link to="/help" className="z-10 self-stretch my-auto whitespace-nowrap hover:text-gray-600">
            Help
          </Link>
          <Link to="/orders" className="z-10 self-stretch my-auto hover:text-gray-600">
            Orders & Returns
          </Link>
          {isAuthenticated ? (
            <div className="flex gap-4 items-center">
              <Link to="/account" className="z-10 self-stretch text-right hover:text-gray-600">
                Hi, {userName || 'User'}
              </Link>
              <button
                onClick={handleLogout}
                className="z-10 hover:text-gray-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="z-10 self-stretch text-right hover:text-gray-600">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-7 justify-between items-start self-center px-4 mt-2 w-full max-w-[1400px] max-md:flex-col max-md:items-center">
        <Link to={isAuthenticated ? "/category" : "/"} className="self-stretch text-3xl font-bold text-black hover:opacity-80 max-md:text-center">
          ECOMMERCE
        </Link>
        <div className="flex gap-14 mt-4 text-base font-semibold text-black max-lg:gap-8 max-md:gap-6 max-sm:flex-wrap max-sm:justify-center">
          <Link to="/categories" className="grow hover:text-gray-600">Categories</Link>
          <Link to="/sale" className="hover:text-gray-600">Sale</Link>
          <Link to="/clearance" className="hover:text-gray-600">Clearance</Link>
          <Link to="/new" className="hover:text-gray-600">New stock</Link>
          <Link to="/trending" className="hover:text-gray-600">Trending</Link>
        </div>
        <div className="flex gap-8 mt-2.5 max-md:mt-4">
          <Link to="/search" className="hover:opacity-80">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9f44306bbd0e51cef956764fb35d9e4b335c6ceedf4ac4305b4a39d615e8c5b"
              className="object-contain shrink-0 w-8 aspect-square"
              alt="Search Icon"
            />
          </Link>
          <Link to="/cart" className="hover:opacity-80">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7b5a1d1ea050cd8214a3c6b75f35155739321540846412f1523e93187ba89f96"
              className="object-contain shrink-0 w-8 aspect-square"
              alt="Cart Icon"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;