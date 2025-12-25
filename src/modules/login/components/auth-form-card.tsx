import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Chrome, Apple, Facebook, Loader2 } from 'lucide-react';
import { FormInput } from './form-input';
import { toast } from 'sonner';

import { authService } from '@/services/auth.service';

interface AuthFormCardProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({ isLogin, setIsLogin }) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await authService.login(email, password);
        toast.success(t('auth.login_success'));        
        window.location.href = '/';
      } else {
        await authService.signup(email, password, name);
        toast.success(t('auth.signup_success'));
        window.location.href = '/'; 
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || t('auth.error_generic');

      toast.error(errorMessage, {
        description: t('auth.invalid_password'),
        duration: 4000,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    console.log(`${provider} authentication`);
  };

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
        {t('auth.login_tab')}
      </button>
      <button
        onClick={() => setIsLogin(false)}
        className={`flex-1 py-1.5 px-3 rounded-lg transition-all duration-300 text-sm ${
          !isLogin
              ? 'bg-white text-gray-900 shadow-lg scale-105'
              : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {t('auth.signup_tab')}
      </button>
    </div>
  );

  const OAuthButtons = () => (
    <div className="space-y-2 mb-4">
        <button
            onClick={() => handleOAuth('Google')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 group text-sm"
        >
            <Chrome className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700">{t('auth.google_btn')}</span>
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
  
  const MobileHeader = () => (
    <div className="lg:hidden text-center mb-3">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-green-500 rounded-2xl mb-2 shadow-xl">
          <span className="text-2xl">🍽️</span>
      </div>
      <h1 className="text-white mb-1 drop-shadow">{t('auth.mobile_title')}</h1>
    </div>
  );

  const FormFooter = () => (
    <>
      <p className="text-center text-gray-600 mt-3 text-xs">
        {isLogin ? t('auth.no_account') : t('auth.has_account')}{' '}
        <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 hover:text-orange-700 hover:underline transition-all"
        >
            {isLogin ? t('auth.signup_free') : t('auth.login_here')}
        </button>
      </p>

      <p className="text-center text-gray-200 mt-2 px-4 text-xs drop-shadow">
        {t('auth.agreement')}{' '}
        <a href="#" className="text-orange-400 hover:underline">{t('auth.terms')}</a>
        {' & '}
        <a href="#" className="text-orange-400 hover:underline">{t('auth.privacy')}</a>
      </p>
    </>
  );


  return (
    <div className="w-full max-w-sm mx-auto max-h-[80vh] overflow-y-auto lg:col-span-2">
      <MobileHeader />

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20">
        <AuthToggleButton />

        <OAuthButtons />

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-white text-gray-500 text-xs">{t('auth.or_email')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div className="transform transition-all duration-300">
              <FormInput
                id="name"
                label={t('auth.fields.name')}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.fields.name_placeholder')}
                required={!isLogin}
              />
            </div>
          )}

          {/* Email Input */}
          <FormInput
            id="email"
            label={t('auth.fields.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.fields.email_placeholder')}
            required
          />

          {/* Password Input */}
          <FormInput
            id="password"
            label={t('auth.fields.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.fields.password_placeholder')}
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
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{t('auth.remember_me')}</span>
            </label>
            <button
              type="button"
              className="text-orange-600 hover:text-orange-700 hover:underline transition-all"
            >
              {t('auth.forgot_password')}
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
                {t('auth.processing')}
              </>
            ) : (
              isLogin ? t('auth.submit_login') : t('auth.submit_signup')
            )}
          </button>
        </form>
      </div>
      
      {/* Footer */}
      <FormFooter />
    </div>
  );
};