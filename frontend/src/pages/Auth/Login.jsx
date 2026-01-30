import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-primary">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">ShopKart</h1>
          <p className="text-blue-100 text-lg">India's Most Trusted E-Commerce Platform</p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Millions of Products</h3>
              <p className="text-blue-100 text-sm">Shop from a vast selection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Fast Delivery</h3>
              <p className="text-blue-100 text-sm">Get orders in 2-3 days</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Secure Payments</h3>
              <p className="text-blue-100 text-sm">100% safe transactions</p>
            </div>
          </div>
        </div>

        <p className="text-blue-200 text-sm relative z-10">
          © 2026 ShopKart. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-brand">ShopKart</h1>
            <p className="text-secondary mt-1">Welcome back!</p>
          </div>

          <div className="card-elevated p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-secondary">
                Sign in to access your account, orders, and wishlist
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-secondary">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input h-14 text-base"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-secondary">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-input pr-12 h-14 text-base"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
                  <span className="text-secondary">Remember me</span>
                </label>
                <Link to="#" className="text-brand font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full btn btn-primary h-14 text-base font-semibold"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="loader w-5 h-5 border-2 border-white/30 border-t-white" />
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <FiArrowRight size={18} />
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-secondary">
              New to ShopKart?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-brand font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-muted mt-6">
            By signing in, you agree to our{" "}
            <Link to="#" className="text-brand hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="#" className="text-brand hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
