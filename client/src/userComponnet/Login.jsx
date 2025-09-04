import { useState, useEffect } from 'react';
import {  useGoogleLogin } from '@react-oauth/google';
import instance from '../instance';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../feature/userSlice';
import { userLogin } from '../User_apiservices/account';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError('');
      if (!email || !password) {
        setError('Both fields are required');
        return;
      }
        await userLogin(
        email,
        password,
        dispatch,
        navigate,
        toast
      );
    } catch (err) {
      console.log(err);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log('Login Successful:', credentialResponse);
      setUser(credentialResponse);
    },
    onError: (error) => {
      console.log('Login Failed:', error);
    },
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json',
              },
            }
          );
          console.log(response.data);

          const res = await instance.post('user/google-login', {
            profile: response.data,
          });
          if (res.status === 200 || res.status === 201) {
            console.log(res);
            dispatch(setUserDetails(res.data.user));
            navigate('/');
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUserInfo();
  }, [user,dispatch,navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          <div>
            <Toaster position="top-center" richColors />
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        <br />

        <button
          onClick={() => login()}
          className="w-full rounded-md bg-black border-2 border-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up here
          </Link>
          <br></br>
          <Link
            to="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forget password
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
