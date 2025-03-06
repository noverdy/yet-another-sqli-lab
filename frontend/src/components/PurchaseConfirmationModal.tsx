interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface PurchaseMessage {
  type: 'success' | 'error';
  text: string;
}

interface PurchaseConfirmationModalProps {
  selectedPackage: Package;
  showConfirmation: boolean;
  isProcessing: boolean;
  purchaseMessage: PurchaseMessage | null;
  onConfirm: () => void;
  onCancel: () => void;
  onTryAgain?: () => void;
  formatCurrency: (amount: number) => string;
}

export default function PurchaseConfirmationModal({
  selectedPackage,
  showConfirmation,
  isProcessing,
  purchaseMessage,
  onConfirm,
  onCancel,
  onTryAgain,
  formatCurrency,
}: PurchaseConfirmationModalProps) {
  if (!showConfirmation || !selectedPackage) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>

        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>

        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              {!isProcessing && !purchaseMessage && (
                <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10'>
                  <svg
                    className='h-6 w-6 text-indigo-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
              )}

              {purchaseMessage && purchaseMessage.type === 'success' && (
                <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10'>
                  <svg
                    className='h-6 w-6 text-green-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              )}

              {purchaseMessage && purchaseMessage.type === 'error' && (
                <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                  <svg
                    className='h-6 w-6 text-red-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </div>
              )}

              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  {purchaseMessage
                    ? purchaseMessage.type === 'success'
                      ? 'Purchase Successful'
                      : 'Purchase Failed'
                    : 'Confirm Purchase'}
                </h3>

                {!isProcessing && !purchaseMessage && (
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      Are you sure you want to purchase the{' '}
                      <span className='font-medium'>
                        {selectedPackage.name}
                      </span>{' '}
                      package for{' '}
                      <span className='font-medium'>
                        {formatCurrency(selectedPackage.price)}
                      </span>{' '}
                      per month?
                    </p>
                  </div>
                )}

                {isProcessing && !purchaseMessage && (
                  <div className='mt-4'>
                    <p className='text-sm text-gray-500 mb-4'>
                      Processing your purchase, please wait...
                    </p>
                    <div className='w-full bg-gray-200 rounded-full h-2.5'>
                      <div className='bg-indigo-600 h-2.5 rounded-full animate-pulse w-full'></div>
                    </div>
                  </div>
                )}

                {purchaseMessage && (
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      purchaseMessage.type === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {purchaseMessage.text}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Only show buttons when not processing */}
          {(!isProcessing || purchaseMessage) && (
            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              {!purchaseMessage && (
                <button
                  type='button'
                  onClick={onConfirm}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Confirm Purchase
                </button>
              )}

              {purchaseMessage && purchaseMessage.type === 'success' && (
                <button
                  type='button'
                  onClick={onCancel}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Done
                </button>
              )}

              {purchaseMessage && purchaseMessage.type === 'error' && (
                <button
                  type='button'
                  onClick={onTryAgain || onConfirm}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Try Again
                </button>
              )}

              {(purchaseMessage?.type === 'error' || !purchaseMessage) && (
                <button
                  type='button'
                  onClick={onCancel}
                  className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
