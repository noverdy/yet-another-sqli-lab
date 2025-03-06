import useAuthStore from '@/stores/authStore';
import debounce from '@/utils/debounce';
import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const authFetch = useAuthStore((s) => s.authFetch);

  useEffect(() => {
    const fetchPackages = async () => {
      const response = await authFetch('/internet-packages/');
      const data = await response.json();
      setAllPackages(data);
      setPackages(data);
    };

    fetchPackages();
  }, []);

  const handleSearch = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm === '') {
      setPackages(allPackages);
    } else {
      const response = await authFetch('/internet-packages/?q=' + searchTerm);
      const data = await response.json();
      setPackages(data);
    }
  }, 500);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-blue-50 flex flex-col'>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08]"></div>

      {/* Header */}
      <header className='relative z-10 bg-white/70 backdrop-blur-sm shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Internet Packages
              </h1>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={handleLogout}
                className='flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7z'
                    clipRule='evenodd'
                  />
                  <path d='M7 14a1 1 0 100-2 1 1 0 000 2zm6-1a1 1 0 10-2 0 1 1 0 002 0zM7 8a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 10-2 0 1 1 0 002 0z' />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='relative z-10 lg:w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Welcome back, {user?.name}!
          </h2>
          <p className='mt-1 text-lg text-indigo-600'>
            Discover the perfect internet package for your needs
          </p>
        </div>

        {/* Search Bar */}
        <div className='mb-8'>
          <div className='relative rounded-lg shadow-sm max-w-lg'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-gray-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <input
              type='text'
              onChange={handleSearch}
              className='pl-10 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out'
              placeholder='Search packages by name or description...'
            />
          </div>
        </div>

        {/* Packages Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className='bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 relative'
              >
                <div className='h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold text-gray-900'>
                    {pkg.name}
                  </h3>
                  <p className='mt-2 text-gray-600'>{pkg.description}</p>
                  <div className='mt-4 flex justify-between items-end'>
                    <p className='text-2xl font-bold text-indigo-600'>
                      {formatCurrency(pkg.price)}
                      <span className='text-sm font-normal text-gray-500'>
                        /month
                      </span>
                    </p>
                    <button
                      type='button'
                      className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No packages found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                Try adjusting your search term.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className='relative z-10 bg-white/70 backdrop-blur-sm border-t border-gray-200 py-4 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-center text-sm text-gray-500'>
            &copy;{new Date().getFullYear()} Internet Service Provider. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
