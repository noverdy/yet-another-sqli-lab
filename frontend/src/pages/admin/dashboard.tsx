import useAuthStore from '@/stores/authStore';
import useGlobalStore from '@/stores/globalStore';
import debounce from '@/utils/debounce';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface PackageFormData {
  name: string;
  description: string;
  price: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    price: 0,
  });

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

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setCurrentPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (pkg: Package) => {
    setCurrentPackage(pkg);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await authFetch('/internet-packages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newPackage = await response.json();
      setAllPackages([...allPackages, newPackage]);
      setPackages([...packages, newPackage]);
      setIsCreateModalOpen(false);
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPackage) return;

    const optimisticPackage = {
      ...currentPackage,
      ...formData,
    };

    const optimisticPackages = allPackages.map((p) =>
      p.id === currentPackage.id ? optimisticPackage : p,
    );
    setAllPackages(optimisticPackages);
    setPackages(
      optimisticPackages.filter((p) =>
        packages.some((existingPkg) => existingPkg.id === p.id),
      ),
    );
    setIsEditModalOpen(false);

    try {
      const response = await authFetch(
        `/internet-packages/${currentPackage.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update package');
      }
    } catch (error) {
      console.error('Failed to update package:', error);
      const revertedPackages = allPackages.map((p) =>
        p.id === currentPackage.id ? currentPackage : p,
      );
      setAllPackages(revertedPackages);
      setPackages(
        revertedPackages.filter((p) =>
          packages.some((existingPkg) => existingPkg.id === p.id),
        ),
      );
    }
  };

  const handleDelete = async () => {
    if (!currentPackage) return;

    const response = await authFetch(
      `/internet-packages/${currentPackage.id}`,
      {
        method: 'DELETE',
      },
    );

    if (response.ok) {
      const filteredPackages = allPackages.filter(
        (p) => p.id !== currentPackage.id,
      );
      setAllPackages(filteredPackages);
      setPackages(filteredPackages);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-tr from-gray-800 via-gray-900 to-black flex flex-col'>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08]"></div>

      {/* Header */}
      <header className='relative z-10 bg-gray-800/70 backdrop-blur-sm shadow-md border-b border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center'>
              <div className='bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mr-3'>
                ADMIN
              </div>
              <h1 className='text-2xl font-bold text-white'>
                {useGlobalStore.getState().APP_NAME} Packages Management
              </h1>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={handleLogout}
                className='flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all duration-200'
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
        <div className='mb-8 flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold text-white'>Admin Dashboard</h2>
            <p className='mt-1 text-lg text-gray-300'>
              Manage internet packages and services
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-all duration-200'
          >
            <svg
              className='mr-2 h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Create New Package
          </button>
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
              className='pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out'
              placeholder='Search packages by name or description...'
            />
          </div>
        </div>

        {/* Packages Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {allPackages.length === 0 ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className='bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-gray-700 relative animate-pulse'
              >
                <div className='h-2 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-50'></div>
                <div className='p-6'>
                  <div className='h-6 bg-gray-600 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-600 rounded w-full mb-2'></div>
                  <div className='h-4 bg-gray-600 rounded w-5/6 mb-2'></div>
                  <div className='h-4 bg-gray-600 rounded w-4/6 mb-4'></div>
                  <div className='mt-4 flex justify-between items-end'>
                    <div className='h-8 bg-blue-800 rounded w-1/3'></div>
                    <div className='flex space-x-2'>
                      <div className='h-8 w-16 bg-blue-900/50 rounded'></div>
                      <div className='h-8 w-16 bg-red-900/50 rounded'></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className='bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-700 relative'
              >
                <div className='h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'></div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold text-white'>{pkg.name}</h3>
                  <p className='mt-2 text-gray-300'>{pkg.description}</p>
                  <div className='mt-4 flex justify-between items-end'>
                    <p className='text-2xl font-bold text-blue-400'>
                      {formatCurrency(pkg.price)}
                      <span className='text-sm font-normal text-gray-400'>
                        /month
                      </span>
                    </p>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => openEditModal(pkg)}
                        className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-400 bg-blue-900/50 hover:bg-blue-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200'
                      >
                        <svg
                          className='h-4 w-4 mr-1'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(pkg)}
                        className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-400 bg-red-900/50 hover:bg-red-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200'
                      >
                        <svg
                          className='h-4 w-4 mr-1'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
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
              <h3 className='mt-2 text-sm font-medium text-gray-200'>
                No packages found
              </h3>
              <p className='mt-1 text-sm text-gray-400'>
                Try adjusting your search term or create a new package.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className='relative z-10 bg-gray-800/70 backdrop-blur-sm border-t border-gray-700 py-4 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-center text-sm text-gray-400'>
            &copy;{new Date().getFullYear()}{' '}
            {useGlobalStore.getState().APP_NAME} - Admin Panel. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity'
              aria-hidden='true'
            >
              <div className='absolute inset-0 bg-gray-900 opacity-75'></div>
            </div>
            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <div className='inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
              <div className='bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <h3 className='text-xl font-bold text-white mb-4'>
                  Create New Package
                </h3>
                <form onSubmit={handleCreateSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-300'
                    >
                      Package Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='description'
                      className='block text-sm font-medium text-gray-300'
                    >
                      Description
                    </label>
                    <textarea
                      name='description'
                      id='description'
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    ></textarea>
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='price'
                      className='block text-sm font-medium text-gray-300'
                    >
                      Price (IDR)
                    </label>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      required
                      min='0'
                      value={formData.price}
                      onChange={handleInputChange}
                      className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      type='button'
                      onClick={() => setIsCreateModalOpen(false)}
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity'
              aria-hidden='true'
            >
              <div className='absolute inset-0 bg-gray-900 opacity-75'></div>
            </div>
            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <div className='inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
              <div className='bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <h3 className='text-xl font-bold text-white mb-4'>
                  Edit Package
                </h3>
                <form onSubmit={handleEditSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='edit-name'
                      className='block text-sm font-medium text-gray-300'
                    >
                      Package Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='edit-name'
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='edit-description'
                      className='block text-sm font-medium text-gray-300'
                    >
                      Description
                    </label>
                    <textarea
                      name='description'
                      id='edit-description'
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    ></textarea>
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='edit-price'
                      className='block text-sm font-medium text-gray-300'
                    >
                      Price (IDR)
                    </label>
                    <input
                      type='number'
                      name='price'
                      id='edit-price'
                      required
                      min='0'
                      value={formData.price}
                      onChange={handleInputChange}
                      className='mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      type='button'
                      onClick={() => setIsEditModalOpen(false)}
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity'
              aria-hidden='true'
            >
              <div className='absolute inset-0 bg-gray-900 opacity-75'></div>
            </div>
            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <div className='inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
              <div className='bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                    <svg
                      className='h-6 w-6 text-red-600'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                      />
                    </svg>
                  </div>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <h3 className='text-lg leading-6 font-medium text-white'>
                      Delete Package
                    </h3>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-300'>
                        Are you sure you want to delete the package "
                        {currentPackage?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                  <button
                    type='button'
                    onClick={handleDelete}
                    className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                  >
                    Delete
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsDeleteModalOpen(false)}
                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
