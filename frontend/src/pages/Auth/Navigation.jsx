import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${showSidebar ? "hidden" : "flex"
        } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white h-[100vh] fixed`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-2">
        <Link
          to="/"
          className="flex items-center py-3 px-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10 group"
        >
          <AiOutlineHome className="mr-3 mt-[2rem] text-dark-500 group-hover:text-primary-400" size={24} />
          <span className="hidden nav-item-name mt-[2rem] text-dark-400 group-hover:text-white">
            Home
          </span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center py-3 px-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10 group"
        >
          <AiOutlineShopping className="mr-3 mt-[2rem] text-dark-500 group-hover:text-primary-400" size={24} />
          <span className="hidden nav-item-name mt-[2rem] text-dark-400 group-hover:text-white">
            Shop
          </span>
        </Link>

        <Link
          to="/cart"
          className="flex items-center py-3 px-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10 group relative"
        >
          <div className="flex items-center">
            <AiOutlineShoppingCart className="mt-[2rem] mr-3 text-dark-500 group-hover:text-primary-400" size={24} />
            <span className="hidden nav-item-name mt-[2rem] text-dark-400 group-hover:text-white">
              Cart
            </span>
          </div>

          {cartItems.length > 0 && (
            <span className="absolute left-7 top-7 px-2 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-400 rounded-full shadow-glow">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>

        <Link
          to="/favorite"
          className="flex items-center py-3 px-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10 group relative"
        >
          <div className="flex items-center">
            <FaHeart className="mt-[2rem] mr-3 text-dark-500 group-hover:text-accent-pink" size={20} />
            <span className="hidden nav-item-name mt-[2rem] text-dark-400 group-hover:text-white">
              Favorites
            </span>
          </div>
          <FavoritesCount />
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center w-full py-3 px-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10 group"
        >
          {userInfo ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center text-sm font-bold">
                {userInfo.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden nav-item-name ml-3 text-white font-medium">
                {userInfo.username}
              </span>
              {dropdownOpen ? (
                <FaChevronUp className="hidden nav-item-name ml-auto text-dark-500" size={12} />
              ) : (
                <FaChevronDown className="hidden nav-item-name ml-auto text-dark-500" size={12} />
              )}
            </>
          ) : null}
        </button>

        {dropdownOpen && userInfo && (
          <ul className="nav-dropdown absolute right-0 bottom-full mb-2 min-w-[200px]">
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-3 hover:bg-primary-500/10 text-gray-300 hover:text-primary-400 transition-all"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-3 hover:bg-primary-500/10 text-gray-300 hover:text-primary-400 transition-all"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-3 hover:bg-primary-500/10 text-gray-300 hover:text-primary-400 transition-all"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-3 hover:bg-primary-500/10 text-gray-300 hover:text-primary-400 transition-all"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-3 hover:bg-primary-500/10 text-gray-300 hover:text-primary-400 transition-all"
                  >
                    Users
                  </Link>
                </li>
                <li className="border-t border-dark-300 my-1"></li>
              </>
            )}

            <li>
              <Link
                to="/profile"
                className="block px-4 py-3 hover:bg-primary-500/10 text-gray-300 hover:text-primary-400 transition-all"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-3 text-left hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all"
              >
                Logout
              </button>
            </li>
          </ul>
        )}

        {!userInfo && (
          <ul className="space-y-2">
            <li>
              <Link
                to="/login"
                className="flex items-center py-3 px-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10 group"
              >
                <AiOutlineLogin className="mr-3 text-dark-500 group-hover:text-primary-400" size={24} />
                <span className="hidden nav-item-name text-dark-400 group-hover:text-white">
                  Login
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center py-3 px-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10 group"
              >
                <AiOutlineUserAdd className="mr-3 text-dark-500 group-hover:text-primary-400" size={24} />
                <span className="hidden nav-item-name text-dark-400 group-hover:text-white">
                  Register
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
