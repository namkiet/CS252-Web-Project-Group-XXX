import { useState } from 'react';
import { Chrome, Apple, Facebook, Loader2 } from 'lucide-react';
import { FormInput } from './form-input';

import { authService } from '@/services/auth.service';

interface AuthFormCardProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({ isLogin, setIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // Handle logic submission
    try {
      if (isLogin) {
        // Call API Login
        await authService.login(email, password);
        console.log("Login Success");
        // Go to home page
        window.location.href = '/';
      } else {
        // Call API Signup
        await authService.signup(email, password, name);
        console.log("Signup Success");
        // Go to home page
        window.location.href = '/'; 
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

    const handleOAuth = (provider: string) => {
      // Handle logic for OAuth
      console.log(`${provider} authentication`);
    };

    // Component Toggle Tabs (Login/SignUp)
    const AuthToggleButton = () => (
      <div className="flex gap-1.5 mb-4 bg-gray-100/80 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setError(null);
          }}
          className={`flex-1 
            0py-1.5 px-3 rounded-lg transition-all duration-300 text-sm ${
              isLogin
                  ? 'bg-white text-gray-900 shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all duration-300 text-sm ${
            !isLogin
                ? 'bg-white text-gray-900 shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sign Up
        </button>
      </div>
    );

    // Handle OAuth Buttons
    const OAuthButtons = () => (
      <div className="space-y-2 mb-4">
          <button
              onClick={() => handleOAuth('Google')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 group text-sm"
          >
              <Chrome className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700">Continue with Google</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
              <button
                  onClick={() => handleOAuth('Apple')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-black text-white rounded-lg hover:bg-gray-800 hover:shadow-md transition-all duration-200 group text-sm"
              >
                  <Apple className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Apple</span>
              </button>
              <button
                  onClick={() => handleOAuth('Facebook')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 group text-sm"
              >
                  <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
              </button>
          </div>
      </div>
    );
    
    // Component for Mobile Header
    const MobileHeader = () => (
      <div className="lg:hidden text-center mb-3">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-green-500 rounded-2xl mb-2 shadow-xl">
            <span className="text-2xl">🍽️</span>
        </div>
        <h1 className="text-white mb-1 drop-shadow">Food Schedule Planner</h1>
      </div>
    );

    // Component for Footer Text/Terms
    const FormFooter = () => (
      <>
        {/* Footer Text */}
        <p className="text-center text-gray-600 mt-3 text-xs">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-700 hover:underline transition-all"
          >
              {isLogin ? 'Sign up for free' : 'Login here'}
          </button>
        </p>

        {/* Terms */}
        <p className="text-center text-gray-200 mt-2 px-4 text-xs drop-shadow">
          By continuing, you agree to our{' '}
          <a href="#" className="text-orange-400 hover:underline">Terms</a>
          {' & '}
          <a href="#" className="text-orange-400 hover:underline">Privacy Policy</a>
        </p>
      </>
    );


    return (
      // Container of Form (2 last column)
      <div className="w-full max-w-sm mx-auto max-h-[80vh] overflow-y-auto lg:col-span-2">
        {/* Header on Mobile */}
        <MobileHeader />

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20">
          {/* Login/Sign Up */}
          <AuthToggleButton />

          {/* OAuth Buttons */}
          <OAuthButtons />

          {/* Divider Line */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-500 text-xs">or continue with email</span>
            </div>
          </div>

          {/* Form Email/Password */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Input (For Only Sign Up) */}
            {!isLogin && (
              <div className="transform transition-all duration-300">
                <FormInput
                  id="name"
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email Input */}
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {/* Password Input */}
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {/* Remember me & Forgot password (For only Login) */}
            {isLogin && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                className="text-orange-600 hover:text-orange-700 hover:underline transition-all"
              >
                Forgot password?
              </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 text-white py-2.5 px-4 rounded-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-3 text-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                isLogin ? 'Login to Your Account' : 'Create Your Account'
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <FormFooter />
      </div>
    );
};