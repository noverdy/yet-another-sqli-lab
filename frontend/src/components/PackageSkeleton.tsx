export default function PackageSkeleton() {
  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-gray-100 relative animate-pulse'>
      <div className='h-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300'></div>
      <div className='p-6'>
        <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6 mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-4/6 mb-4'></div>
        <div className='mt-4 flex justify-between items-end'>
          <div className='h-8 bg-indigo-200 rounded w-1/3'></div>
          <div className='h-8 bg-indigo-100 rounded w-1/4'></div>
        </div>
      </div>
    </div>
  );
}
