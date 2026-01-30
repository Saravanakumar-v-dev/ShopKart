import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiShoppingCart, FiChevronDown, FiSun, FiMoon, FiUser, FiHeart, FiLogOut, FiSettings } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useLogoutMutation } from "../redux/api/usersApiSlice";
import { logout } from "../redux/features/auth/authSlice";

const TopHeader = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme, toggleTheme } = useTheme();

    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const favorites = useSelector((state) => state.favorites) || [];

    const [logoutApiCall] = useLogoutMutation();

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <header className="header">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex flex-col items-center shrink-0">
                        <span className="text-xl font-bold italic text-white">ShopKart</span>
                        <span className="text-[10px] text-yellow-400 italic flex items-center gap-1">
                            Explore <span className="text-white">Plus</span> <FiChevronDown size={10} />
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="search-box hidden sm:flex">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="text-blue-500 hover:text-blue-600">
                            <FiSearch size={20} />
                        </button>
                    </form>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? (
                                <FiSun size={20} className="text-yellow-400" />
                            ) : (
                                <FiMoon size={20} className="text-white" />
                            )}
                        </button>

                        {/* User Menu */}
                        {userInfo ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors"
                                >
                                    <FiUser size={18} />
                                    <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                                        {userInfo.username}
                                    </span>
                                    <FiChevronDown size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-default rounded shadow-lg z-50 animate-slide-up">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-hover text-secondary transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <FiUser size={16} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to="/favorite"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-hover text-secondary transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <FiHeart size={16} />
                                            <span>Wishlist ({favorites.length})</span>
                                        </Link>
                                        {userInfo.isAdmin && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-hover text-secondary transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <FiSettings size={16} />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-hover text-secondary transition-colors w-full text-left border-t border-default"
                                        >
                                            <FiLogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="btn-secondary bg-white text-primary-500 px-6 py-2 text-sm font-medium"
                            >
                                Login
                            </Link>
                        )}

                        {/* Favorites */}
                        <Link
                            to="/favorite"
                            className="relative p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                        >
                            <FiHeart size={20} />
                            {favorites.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-2 p-2 hover:bg-white/10 rounded transition-colors"
                        >
                            <FiShoppingCart size={20} />
                            <span className="hidden md:block text-sm font-medium">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="search-box sm:hidden mb-3">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="text-blue-500">
                        <FiSearch size={18} />
                    </button>
                </form>
            </div>
        </header>
    );
};

export default TopHeader;
