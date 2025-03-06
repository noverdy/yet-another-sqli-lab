export default function NoPackagesFound() {
  return (
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
  );
}
