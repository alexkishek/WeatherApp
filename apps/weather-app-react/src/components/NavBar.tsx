import {Link, useNavigate} from "react-router-dom";
import { FaHome, FaCity, FaMap, FaCog, FaCloudSun, FaUser } from "react-icons/fa";
import { isAuthenticated } from "../utils/authUtils";
import {FaRightToBracket} from "react-icons/fa6";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/');
  };

  return (
    <div className="w-[100px] hidden md:flex flex-col items-center h-full w-20 bg-base-200 py-6 rounded-r-xl">
      <div className="mb-12">
        <FaCloudSun className="text-4xl mb-2" />
      </div>

      <div className="flex flex-col h-full justify-between">
        <div className="space-y-6">
          <Link
            to="/"
            className="card w-full bg-base-200 p-4 flex flex-col items-center hover:bg-primary hover:text-white transition"
          >
            <FaHome className="text-2xl mb-2" />
            <span className="text-sm">Weather</span>
          </Link>

          {isAuthenticated() && (
            <>
              <Link
                to="/cities"
                className="card w-full bg-base-200 p-4 flex flex-col items-center hover:bg-primary hover:text-white transition"
              >
                <FaCity className="text-2xl mb-2" />
                <span className="text-sm">Cities</span>
              </Link>

              <Link
                to="/settings"
                className="card w-full bg-base-200 p-4 flex flex-col items-center hover:bg-primary hover:text-white transition"
              >
                <FaCog className="text-2xl mb-2" />
                <span className="text-sm">Settings</span>
              </Link>
            </>
          )}
        </div>

        <div className={'flex justify-center'}>
          <div className="dropdown dropdown-top">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="rounded-full">
                <FaUser className="text-3xl mb-2" />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 space-y-2 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {isAuthenticated() ? (
                <>
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
              ) : (
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
      </div>
    </div>
  );
}

export default NavBar;
