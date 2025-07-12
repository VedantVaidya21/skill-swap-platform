import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { swapAPI, feedbackAPI } from '../../services/api';

const FeedbackForm = () => {
  const { swapId } = useParams();
  const navigate = useNavigate();
  
  const [swapDetails, setSwapDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchSwapDetails();
  }, [swapId]);

  const fetchSwapDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch swap request details
      const response = await swapAPI.getSwapRequests({ status: 'completed' });
      const swap = response.data.find(s => s.id === parseInt(swapId));
      
      if (!swap) {
        setError('Swap request not found or not completed yet.');
        setLoading(false);
        return;
      }
      
      setSwapDetails(swap);
      
      // Check if user already submitted feedback for this swap
      try {
        const feedbackResponse = await feedbackAPI.getUserFeedback();
        const existingFeedback = feedbackResponse.data.find(f => f.swap_request === parseInt(swapId));
        
        if (existingFeedback) {
          setAlreadySubmitted(true);
          setError('You have already submitted feedback for this swap.');
        }
      } catch (feedbackError) {
        console.error('Error checking existing feedback:', feedbackError);
      }
    } catch (error) {
      console.error('Error fetching swap details:', error);
      setError('Failed to load swap details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      setError('Please provide some feedback comments.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await feedbackAPI.createFeedback({
        swap_request: parseInt(swapId),
        rating: formData.rating,
        comment: formData.comment
      });
      
      setSuccessMessage('Feedback submitted successfully!');
      
      // Redirect back to swap requests page after a delay
      setTimeout(() => {
        navigate('/swap-requests');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.response?.data?.detail || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to render star rating input
  const renderStarRating = () => {
    return (
      <div className="flex items-center">
        {[5, 4, 3, 2, 1].map((star) => (
          <label key={star} className="cursor-pointer p-1">
            <input
              type="radio"
              name="rating"
              value={star}
              checked={formData.rating === star}
              onChange={handleChange}
              className="sr-only"
            />
            <svg 
              className={`h-8 w-8 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </label>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        <p className="mt-2 text-gray-600">Loading swap details...</p>
      </div>
    );
  }

  if (error && !swapDetails) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/swap-requests')}
            className="btn btn-primary"
          >
            Back to Swap Requests
          </button>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-8">
          <h1 className="mb-4">Feedback Already Submitted</h1>
          <p className="text-gray-600 mb-6">
            You have already provided feedback for this skill swap.
          </p>
          <button
            onClick={() => navigate('/swap-requests')}
            className="btn btn-primary"
          >
            Back to Swap Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-center">Provide Feedback</h1>
        
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
        
        {swapDetails && (
          <>
            {/* Swap details summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Skill Swap Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">You learned:</p>
                  <p className="font-medium">{swapDetails.recipient_skill_name}</p>
                  <p className="text-sm text-gray-500 mt-1">Taught by:</p>
                  <p>{swapDetails.recipient_username}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">You taught:</p>
                  <p className="font-medium">{swapDetails.requester_skill_name}</p>
                  <p className="text-sm text-gray-500 mt-1">Learned by:</p>
                  <p>{swapDetails.requester_username}</p>
                </div>
              </div>
            </div>
            
            {/* Feedback form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you rate your experience?
                </label>
                {renderStarRating()}
              </div>
              
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  className="input"
                  placeholder="Share your experience with this skill swap..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/swap-requests')}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm; 