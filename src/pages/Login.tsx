import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLoginSuccess: () => void;
}

interface User {
  name: string;
  email: string;
  password: string;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get registered users from localStorage
    const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Check if user exists and credentials match
    const user = registeredUsers.find(
      (user: User) => user.email === formData.email && user.password === formData.password
    );

    if (user) {
      // Store user info in localStorage
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          name: user.name,
          email: user.email,
        })
      );

      onLoginSuccess();
      navigate('/category');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-[576px] bg-white rounded-3xl border border-solid border-stone-300 p-8 md:p-16">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-black">Login</h1>
            <p className="mt-4 font-medium text-2xl text-black">
              Welcome back to ECOMMERCE
            </p>
            <p className="mt-2 text-black">
              The next gen business marketplace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-black mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  className="w-full px-4 py-3 bg-white rounded-md border border-solid border-stone-300 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-black mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter"
                    className="w-full px-4 py-3 bg-white rounded-md border border-solid border-stone-300 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-black hover:text-gray-700 underline underline-offset-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 font-medium tracking-wider text-white uppercase bg-black rounded-md border border-black border-solid hover:bg-gray-900 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <span className="text-zinc-800">Don't have an Account? </span>
            <Link
              to="/signup"
              className="font-semibold tracking-wider text-black uppercase hover:underline px-3"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
