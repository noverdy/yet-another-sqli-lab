import useGlobalStore from '@/stores/globalStore';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = useGlobalStore.getState().API_URL;
      const response = await fetch(API_URL + '/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-50 to-blue-100 p-4 sm:p-6 lg:p-8'>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08]"></div>

      <div className='w-full max-w-md z-10'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-1'>
            Reset Password
          </h1>
          <p className='text-base text-indigo-600 font-medium'>
            We'll send you instructions to reset your password
          </p>
        </div>

        <div className='bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100'>
          <div className='h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>

          <div className='px-8 py-10'>
            {error && (
              <div className='mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-red-600'>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!isSuccess ? (
              <form className='space-y-6' onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Email Address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <svg
                        className='h-5 w-5 text-gray-400'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                        <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                      </svg>
                    </div>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      value={email}
                      onChange={handleChange}
                      className='pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out'
                      placeholder='you@example.com'
                    />
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full flex justify-center items-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed'
                  >
                    {isLoading ? (
                      <span className='flex items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className='text-center py-6'>
                <div className='mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100'>
                  <svg
                    className='h-8 w-8 text-green-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-gray-900'>
                  Check your email
                </h3>
                <p className='mt-2 text-sm text-gray-600'>
                  We've sent a password reset link to {email}
                </p>
                <div className='mt-6'>
                  <button
                    type='button'
                    onClick={() => {
                      setEmail('');
                      setIsSuccess(false);
                    }}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    Send another link
                  </button>
                </div>
              </div>
            )}

            <div className='mt-8 flex items-center justify-center space-x-2'>
              <span className='text-sm text-gray-500'>
                Remember your password?
              </span>
              <Link
                to='/auth/login'
                className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200'
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-600'>
            Need help?{' '}
            <a href='#' className='text-indigo-600 hover:underline'>
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
