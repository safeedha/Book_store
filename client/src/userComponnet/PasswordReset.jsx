import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import instance from '@/instance';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import OTP from '../Reusable/OTP';
import { passwordReset } from '../User_apiservices/password';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataFromOTP, setDataFromOTP] = useState(false);
  const navigate = useNavigate();

  const handleData = (data) => {
    setDataFromOTP(data);
    setPassword(false);
  };

  useEffect(() => {
    console.log(dataFromOTP);
  }, []);
  const Emailhandling = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post('/user/forgetpassword', { email });
      if (response.status === 200) {
        toast.success('A otp is generated for your registerd mail');
        setPassword(true);
      }
    } catch (error) {
      if (error.response?.data?.message === 'This email is not registered') {
        toast.error('This email is not registered');
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (!(hasLetter && hasNumber)) {
      toast.error('password should contain letter and number');
      return;
    }
    try {
      await passwordReset(email, newPassword, navigate, toast);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gray-100 px-4 py-8 min-h-screen" // Ensuring the background applies to the full screen
    >
      <Toaster position="top-center" richColors />
      {password === false && dataFromOTP === false && (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={Emailhandling}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {password && <OTP email={email} onSendData={handleData} />}

      {dataFromOTP && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
          <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Reset Password
            </h2>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PasswordReset;
