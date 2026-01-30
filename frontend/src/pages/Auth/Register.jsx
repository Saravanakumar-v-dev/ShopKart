import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Password strength check
  const passwordStrength = () => {
    if (!password) return { level: 0, text: "", color: "" };
    if (password.length < 6) return { level: 1, text: "Weak", color: "bg-red-500" };
    if (password.length < 8) return { level: 2, text: "Fair", color: "bg-yellow-500" };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 3, text: "Strong", color: "bg-green-500" };
    }
    return { level: 2, text: "Fair", color: "bg-yellow-500" };
  };

  const strength = passwordStrength();

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
          <p className="text-blue-100 text-lg">Join millions of happy shoppers</p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FiCheck className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Exclusive Member Deals</h3>
              <p className="text-blue-100 text-sm">Get special discounts</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FiCheck className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Order Tracking</h3>
              <p className="text-blue-100 text-sm">Track your orders live</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FiCheck className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Wishlist & Alerts</h3>
              <p className="text-blue-100 text-sm">Never miss a deal</p>
            </div>
          </div>
        </div>

        <p className="text-blue-200 text-sm relative z-10">
          © 2026 ShopKart. All rights reserved.
        </p>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-3xl font-bold text-brand">ShopKart</h1>
            <p className="text-secondary mt-1">Create your account</p>
          </div>

          <div className="card-elevated p-8 md:p-10">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-secondary">
                Sign up to get started with ShopKart
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-secondary">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input h-12"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-secondary">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input h-12"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-secondary">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-input pr-12 h-12"
                    placeholder="Create a password"
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
                {/* Password Strength Bar */}
                {password && (
                  <div className="flex items-center gap-2 mt-1.5 animate-fade-in">
                    <div className="flex-1 h-1.5 bg-hover rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.level / 3) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>
                      {strength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-secondary">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    className={`form-input pr-12 h-12 ${confirmPassword && confirmPassword !== password
                      ? "border-red-500 focus:border-red-500"
                      : confirmPassword && confirmPassword === password
                        ? "border-green-500 focus:border-green-500"
                        : ""
                      }`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && confirmPassword === password && (
                    <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  )}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded accent-blue-600" required />
                <span className="text-sm text-secondary">
                  I agree to the{" "}
                  <Link to="#" className="text-brand hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="#" className="text-brand hover:underline">Privacy Policy</Link>
                </span>
              </label>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full btn btn-primary h-12 text-base font-semibold mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="loader w-5 h-5 border-2 border-white/30 border-t-white" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <FiArrowRight size={18} />
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-secondary">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-brand font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
