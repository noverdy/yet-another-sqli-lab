interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface PackageCardProps {
  pkg: Package;
  onBuyClick: (pkg: Package) => void;
  formatCurrency: (amount: number) => string;
}

export default function PackageCard({
  pkg,
  onBuyClick,
  formatCurrency,
}: PackageCardProps) {
  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 relative flex flex-col'>
      <div className='h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
      <div className='p-6 grow flex flex-col'>
        <h3 className='text-xl font-bold text-gray-900'>{pkg.name}</h3>
        <p className='mt-2 text-gray-600 grow'>{pkg.description}</p>
        <div className='mt-4 flex justify-between items-end'>
          <p className='text-2xl font-bold text-indigo-600'>
            {formatCurrency(pkg.price)}
            <span className='text-sm font-normal text-gray-500'>/month</span>
          </p>
          <button
            type='button'
            onClick={() => onBuyClick(pkg)}
            className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
