import useAuthStore from '@/stores/authStore';
import useGlobalStore from '@/stores/globalStore';
import debounce from '@/utils/debounce';
import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import PackageCard from '@/components/PackageCard';
import PurchaseConfirmationModal from '@/components/PurchaseConfirmationModal';
import SearchBar from '@/components/SearchBar';
import PackageSkeleton from '@/components/PackageSkeleton';
import NoPackagesFound from '@/components/NoPackagesFound';

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface PurchaseMessage {
  type: 'success' | 'error';
  text: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseMessage, setPurchaseMessage] =
    useState<PurchaseMessage | null>(null);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const authFetch = useAuthStore((s) => s.authFetch);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await authFetch('/internet-packages/');
        const data = await response.json();
        setAllPackages(data);
        setPackages(data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      }
    };

    fetchPackages();
  }, [authFetch]);

  const handleSearch = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm === '') {
      setPackages(allPackages);
    } else {
      try {
        const response = await authFetch('/internet-packages/?q=' + searchTerm);
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error('Failed to search packages:', error);
      }
    }
  }, 200);

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

  const handleBuyClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    setPurchaseMessage(null);

    try {
      const response = await authFetch('/internet-packages/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: selectedPackage.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Purchase failed');
      }

      setPurchaseMessage({
        type: 'success',
        text: `You have successfully purchased ${selectedPackage.name}!`,
      });

      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedPackage(null);
        setPurchaseMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to purchase package:', error);
      setPurchaseMessage({
        type: 'error',
        text: 'Failed to complete your purchase. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPurchase = () => {
    setShowConfirmation(false);
    setSelectedPackage(null);
    setPurchaseMessage(null);
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
                {useGlobalStore.getState().APP_NAME} Internet Packages
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
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Packages Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {allPackages.length === 0 ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <PackageSkeleton key={`skeleton-${index}`} />
            ))
          ) : packages.length > 0 ? (
            // Packages display
            packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onBuyClick={handleBuyClick}
                formatCurrency={formatCurrency}
              />
            ))
          ) : (
            // No packages found
            <NoPackagesFound />
          )}
        </div>
      </main>

      {/* Purchase Confirmation Modal */}
      {selectedPackage && (
        <PurchaseConfirmationModal
          selectedPackage={selectedPackage}
          showConfirmation={showConfirmation}
          isProcessing={isProcessing}
          purchaseMessage={purchaseMessage}
          onConfirm={handleConfirmPurchase}
          onCancel={handleCancelPurchase}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Footer */}
      <footer className='relative z-10 bg-white/70 backdrop-blur-sm border-t border-gray-200 py-4 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-center text-sm text-gray-500'>
            &copy; {new Date().getFullYear()}{' '}
            {useGlobalStore.getState().APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
