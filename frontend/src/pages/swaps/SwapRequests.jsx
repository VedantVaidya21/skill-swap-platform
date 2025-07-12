import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { swapAPI } from '../../services/api';

const SwapRequests = () => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSwapRequests();
  }, [activeTab, statusFilter]);

  const fetchSwapRequests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters = {
        role: activeTab !== 'all' ? activeTab : undefined,
        status: statusFilter || undefined
      };
      
      const response = await swapAPI.getSwapRequests(filters);
      setSwapRequests(response.data);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      setError('Failed to load swap requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (swapId, newStatus) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await swapAPI.updateSwapRequest(swapId, newStatus);
      
      // Update success message based on action
      if (newStatus === 'accepted') {
        setSuccessMessage('Swap request accepted successfully!');
      } else if (newStatus === 'rejected') {
        setSuccessMessage('Swap request rejected.');
      } else if (newStatus === 'completed') {
        setSuccessMessage('Swap marked as completed. Please provide feedback!');
      }
      
      // Refresh the list
      await fetchSwapRequests();
    } catch (error) {
      console.error('Error updating swap request:', error);
      setError('Failed to update swap request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (swapId) => {
    if (!window.confirm('Are you sure you want to delete this swap request?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await swapAPI.deleteSwapRequest(swapId);
      setSuccessMessage('Swap request deleted successfully.');
      
      // Refresh the list
      await fetchSwapRequests();
    } catch (error) {
      console.error('Error deleting swap request:', error);
      setError('Failed to delete swap request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status badge style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1>Swap Requests</h1>
      
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
      
      <div className="card">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent by Me
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Received
            </button>
          </nav>
        </div>
        
        {/* Status filter */}
        <div className="mb-6">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full md:w-64"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        {/* Swap requests list */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-600">Loading swap requests...</p>
          </div>
        ) : swapRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No swap requests found.</p>
            {activeTab === 'all' && !statusFilter && (
              <p className="mt-2">
                <Link to="/search" className="text-primary-600 hover:underline">
                  Search for skills
                </Link>{' '}
                to start a swap request.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {swapRequests.map((swap) => (
              <div key={swap.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(swap.status)}`}>
                      {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                    </span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(swap.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Actions for pending requests */}
                  {swap.status === 'pending' && (
                    <div className="flex space-x-2">
                      {/* Delete button (for requester) */}
                      {activeTab === 'sent' && (
                        <button
                          onClick={() => handleDeleteRequest(swap.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete request"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Accept/Reject buttons (for recipient) */}
                      {activeTab === 'received' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(swap.id, 'accepted')}
                            className="text-green-600 hover:text-green-800"
                            title="Accept request"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(swap.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                            title="Reject request"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Complete button for accepted swaps */}
                  {swap.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(swap.id, 'completed')}
                      className="text-blue-600 hover:text-blue-800"
                      title="Mark as completed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Feedback button for completed swaps */}
                  {swap.status === 'completed' && (
                    <Link
                      to={`/feedback/${swap.id}`}
                      className="text-primary-600 hover:text-primary-800"
                      title="Give feedback"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                </div>
                
                {/* Body */}
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500">
                        {swap.requester_username === swap.recipient_username ? 'You' : swap.requester_username} wants to learn:
                      </p>
                      <p className="font-medium">{swap.recipient_skill_name}</p>
                    </div>
                    
                    <div className="text-center px-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">
                        {swap.recipient_username === swap.requester_username ? 'You' : swap.recipient_username} will teach:
                      </p>
                      <p className="font-medium">{swap.requester_skill_name}</p>
                    </div>
                  </div>
                  
                  {/* Message */}
                  {swap.message && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Message:</p>
                      <p className="text-sm">{swap.message}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapRequests; 