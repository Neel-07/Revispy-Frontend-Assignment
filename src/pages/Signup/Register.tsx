import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

function Register({ onRegisterSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validates form input fields
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handles input change and error clearance
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Check for existing email
      if (existingUsers.some((user: { email: string }) => user.email === formData.email)) {
        setErrors(prev => ({ ...prev, email: 'Email already registered' }));
        setLoading(false);
        return;
      }

      // Register new user
      const newUser = { ...formData };
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Store email for verification page
      sessionStorage.setItem('registrationEmail', formData.email);

      // Generate verification code
      const verificationCode = Math.floor(10000000 + Math.random() * 90000000).toString();
      sessionStorage.setItem('verificationCode', verificationCode);
      console.log('Verification code:', verificationCode);

      // Call onRegisterSuccess before navigation
      onRegisterSuccess();

      // Navigate to verification page
      navigate('/verify-email', { replace: true });
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Registration failed. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex overflow-hidden flex-col mr-8 justify-center items-center bg-white rounded w-full">
      <div className="flex flex-col self-center px-8 sm:px-16 pt-8 sm:pt-10 pb-16 sm:pb-32 mt-6 sm:mt-10 mb-6 sm:mb-10 mx-4 sm:mx-auto max-w-[576px] text-base bg-white rounded-3xl border border-solid border-stone-300 w-full">
        <div className="self-center text-2xl sm:text-3xl font-semibold text-black text-center">
          Create your account
        </div>
        <form onSubmit={handleSubmit}>
          <div className="self-start mt-6 sm:mt-8 text-black">Name</div>
          <div className="flex flex-col mt-2 whitespace-nowrap bg-white rounded-md border border-solid border-stone-300 text-zinc-500">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter"
              className="px-3 sm:px-4 py-3 sm:py-4 bg-white rounded-md border border-solid border-stone-300 w-full"
              required
            />
            {errors.name && <span className="text-red-500 text-xs px-3 sm:px-4 py-1">{errors.name}</span>}
          </div>

          <div className="self-start mt-6 sm:mt-8 text-black">Email</div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter"
              className="w-full px-3 sm:px-4 py-3 sm:py-4 mt-2 whitespace-nowrap bg-white rounded-md border border-solid border-stone-300 text-zinc-500"
              required
            />
            {errors.email && <span className="text-red-500 text-xs px-3 sm:px-4 py-1">{errors.email}</span>}
          </div>

          <div className="self-start mt-6 sm:mt-8 text-black">Password</div>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter"
              className="w-full px-3 sm:px-4 py-3 sm:py-4 mt-2 whitespace-nowrap bg-white rounded-md border border-solid border-stone-300 text-zinc-500"
              required
            />
            {errors.password && <span className="text-red-500 text-xs px-3 sm:px-4 py-1">{errors.password}</span>}
          </div>

          {errors.submit && (
            <div className="mt-4 text-red-500 text-center text-sm">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center whitespace-nowrap px-6 sm:px-8 py-3 sm:py-4 mt-8 sm:mt-10 font-medium tracking-wider text-white uppercase bg-black rounded-md border border-black border-solid h-12 sm:h-14 hover:bg-gray-900 transition-colors duration-200 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Creating account
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="flex gap-2 sm:gap-3 justify-center mt-8 sm:mt-12 mb-0 text-sm sm:text-base">
          <div className="text-zinc-800">Have an Account?</div>
          <Link
            to="/login"
            className="font-medium tracking-wider text-black uppercase whitespace-nowrap hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
