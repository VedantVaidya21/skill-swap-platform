import { useState } from 'react';
import { searchAPI, skillsAPI, swapAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [swapMessage, setSwapMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fetch user's offered skills for swap request
  const fetchUserOfferedSkills = async () => {
    try {
      const response = await skillsAPI.getUserSkills('offered');
      setUserSkills(response.data);
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a skill to search for');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearchResults([]);
    
    try {
      const response = await searchAPI.searchUsers(searchQuery);
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setError(`No users found offering "${searchQuery}" skills`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search for users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open swap request modal
  const openSwapModal = async (user) => {
    setSelectedUser(user);
    setSwapModalOpen(true);
    setSwapMessage('');
    setSelectedSkill('');
    await fetchUserOfferedSkills();
  };

  // Close swap request modal
  const closeSwapModal = () => {
    setSwapModalOpen(false);
    setSelectedUser(null);
  };

  // Send swap request
  const sendSwapRequest = async (e) => {
    e.preventDefault();
    
    if (!selectedSkill) {
      setError('Please select a skill to offer');
      return;
    }
    
    setSendingRequest(true);
    setError('');
    
    try {
      // Find the recipient's skill ID based on the search query
      const recipientSkill = selectedUser.user_skills.find(
        skill => skill.skill_type === 'offered' && skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (!recipientSkill) {
        setError('Could not identify the recipient\'s skill. Please try again.');
        setSendingRequest(false);
        return;
      }
      
      // Send the swap request
      await swapAPI.createSwapRequest({
        recipient: selectedUser.id,
        requester_skill: selectedSkill,
        recipient_skill: recipientSkill.id,
        message: swapMessage
      });
      
      // Close modal and show success message
      closeSwapModal();
      setSuccessMessage(`Swap request sent to ${selectedUser.username} successfully!`);
      
      // Redirect to swap requests page
      setTimeout(() => {
        navigate('/swap-requests');
      }, 2000);
    } catch (error) {
      console.error('Error sending swap request:', error);
      setError(error.response?.data?.detail || 'Failed to send swap request. Please try again.');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1>Find Skills</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {/* Search form */}
      <div className="card mb-8">
        <h2 className="mb-4">Search for Skills</h2>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              placeholder="Enter a skill you want to learn (e.g., Guitar, Spanish, Cooking)"
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary md:w-auto"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 text-red-600">
            {error}
          </div>
        )}
      </div>
      
      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="card">
          <h2 className="mb-4">Users Offering "{searchQuery}"</h2>
          
          <div className="space-y-6">
            {searchResults.map((user) => (
              <div key={user.id} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg">
                {/* User avatar */}
                <div className="flex-shrink-0">
                  {user.profile_photo ? (
                    <img 
                      src={user.profile_photo} 
                      alt={`${user.username}'s profile`} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* User info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                  
                  {user.location && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="inline-block mr-1">📍</span> 
                      {user.location}
                    </p>
                  )}
                  
                  {user.availability && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="inline-block mr-1">🕒</span> 
                      Available: {user.availability}
                    </p>
                  )}
                  
                  {/* Skills */}
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">Skills offered:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.user_skills
                        .filter(skill => skill.skill_type === 'offered')
                        .map(skill => (
                          <span 
                            key={skill.id}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {skill.skill_name}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div>
                
                {/* Action button */}
                <div className="flex-shrink-0 self-center mt-4 md:mt-0">
                  <button
                    onClick={() => openSwapModal(user)}
                    className="btn btn-primary"
                  >
                    Request Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Swap request modal */}
      {swapModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Request Skill Swap with {selectedUser.username}</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form onSubmit={sendSwapRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  You want to learn:
                </label>
                <div className="p-2 bg-gray-100 rounded">
                  {selectedUser.user_skills
                    .filter(skill => 
                      skill.skill_type === 'offered' && 
                      skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(skill => skill.skill_name)
                    .join(', ')}
                </div>
              </div>
              
              <div>
                <label htmlFor="selectedSkill" className="block text-sm font-medium text-gray-700 mb-1">
                  You will teach:
                </label>
                <select
                  id="selectedSkill"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select a skill to offer</option>
                  {userSkills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.skill_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="swapMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional):
                </label>
                <textarea
                  id="swapMessage"
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  className="input h-24"
                  placeholder="Introduce yourself and explain why you want to learn this skill..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeSwapModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sendingRequest}
                >
                  {sendingRequest ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch; 