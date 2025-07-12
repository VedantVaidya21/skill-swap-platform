import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold text-primary-600">404</h1>
      <h2 className="text-2xl font-semibold mt-2 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound; 