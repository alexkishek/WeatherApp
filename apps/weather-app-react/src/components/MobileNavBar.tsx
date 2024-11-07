import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import { FaHome, FaCity, FaCog, FaUser } from "react-icons/fa";
import {FaRightToBracket} from "react-icons/fa6";

function MobileNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/');
  };

  return (
    <div className="fixed bottom-4 left-4 md:hidden z-20 bg-base-300 rounded-full">
      <div className="dropdown dropdown-top">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow space-y-2"
        >
          <li>
            <Link
              to="/"
              className="flex items-center space-x-2 hover:bg-primary hover:text-white transition"
            >
              <FaHome className="text-lg" />
              <span>Home</span>
            </Link>
          </li>

          {isAuthenticated() && (
            <>
              <li>
                <Link
                  to="/cities"
                  className="flex items-center space-x-2 hover:bg-primary hover:text-white transition"
                >
                  <FaCity className="text-lg" />
                  <span>Cities</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 hover:bg-primary hover:text-white transition"
                >
                  <FaCog className="text-lg" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:bg-primary hover:text-white transition"
                >
                  <FaRightToBracket className="text-lg" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}

          {!isAuthenticated() && (
            <>
              <li>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 hover:bg-primary hover:text-white transition"
                >
                  <FaUser className="text-lg" />
                  <span>Create Account</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 hover:bg-primary hover:text-white transition"
                >
                  <FaRightToBracket className="text-lg" />
                  <span>Login</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MobileNavBar;
