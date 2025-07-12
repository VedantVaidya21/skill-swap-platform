import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDropzone } from 'react-dropzone';

const Profile = () => {
  const { currentUser, updateProfile, error } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    location: '',
    availability: '',
    is_public: true,
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        location: currentUser.location || '',
        availability: currentUser.availability || '',
        is_public: currentUser.is_public !== false, // Default to true if undefined
      });
      
      if (currentUser.profile_photo) {
        setPreviewUrl(currentUser.profile_photo);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setProfilePhoto(file);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Create form data for file upload
      const profileData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        profileData.append(key, formData[key]);
      });
      
      // Add profile photo if selected
      if (profilePhoto) {
        profileData.append('profile_photo', profilePhoto);
      }
      
      const success = await updateProfile(profileData);
      if (success) {
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-center">Your Profile</h1>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            
            <div className="flex items-start space-x-6">
              {/* Preview */}
              {previewUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
              
              {/* Dropzone */}
              <div 
                {...getRootProps()} 
                className="flex-1 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col justify-center items-center hover:bg-gray-50 cursor-pointer"
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-600">
                  Drag & drop an image here, or click to select one
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (Max size: 5MB)
                </p>
              </div>
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input"
              />
            </div>
            
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
              placeholder="City, Country"
            />
          </div>
          
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
              Make my profile public (allow others to find me in search)
            </label>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 