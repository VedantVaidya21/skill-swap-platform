import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

// Admin dashboard sub-components
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await adminAPI.banUser(userId);
      setSuccessMessage('User banned successfully.');
      await fetchUsers();
    } catch (error) {
      console.error('Error banning user:', error);
      setError('Failed to ban user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await adminAPI.activateUser(userId);
      setSuccessMessage('User activated successfully.');
      await fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      setError('Failed to activate user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
      
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
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_active ? (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Ban User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateUser(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.getAllSkills();
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSkill = async (skillId) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await adminAPI.approveSkill(skillId);
      setSuccessMessage('Skill approved successfully.');
      await fetchSkills();
    } catch (error) {
      console.error('Error approving skill:', error);
      setError('Failed to approve skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to reject this skill?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await adminAPI.rejectSkill(skillId);
      setSuccessMessage('Skill rejected successfully.');
      await fetchSkills();
    } catch (error) {
      console.error('Error rejecting skill:', error);
      setError('Failed to reject skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Skills</h2>
      
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
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading skills...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{skill.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      skill.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {skill.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(skill.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!skill.is_approved ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveSkill(skill.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectSkill(skill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRejectSkill(skill.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminSwaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSwaps();
  }, [statusFilter]);

  const fetchSwaps = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.getAllSwaps(statusFilter);
      setSwaps(response.data);
    } catch (error) {
      console.error('Error fetching swaps:', error);
      setError('Failed to load swap requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">View Swap Requests</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
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
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading swap requests...</p>
        </div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No swap requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {swaps.map((swap) => (
                <tr key={swap.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{swap.requester_username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{swap.recipient_username}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-500">Requested:</p>
                      <p>{swap.recipient_skill_name}</p>
                      <p className="text-sm text-gray-500 mt-1">Offered:</p>
                      <p>{swap.requester_skill_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(swap.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async (type) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.exportData(type);
      
      // Create a download link for the CSV file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Export Data</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <h3 className="font-medium mb-2">Users Data</h3>
          <p className="text-sm text-gray-600 mb-4">Export all user accounts and their details.</p>
          <button
            onClick={() => handleExport('users')}
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export Users'}
          </button>
        </div>
        
        <div className="card p-4 text-center">
          <h3 className="font-medium mb-2">Swap Requests</h3>
          <p className="text-sm text-gray-600 mb-4">Export all swap requests and their statuses.</p>
          <button
            onClick={() => handleExport('swaps')}
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export Swaps'}
          </button>
        </div>
        
        <div className="card p-4 text-center">
          <h3 className="font-medium mb-2">Feedback Data</h3>
          <p className="text-sm text-gray-600 mb-4">Export all user feedback and ratings.</p>
          <button
            onClick={() => handleExport('feedback')}
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  // Navigation tabs
  const tabs = [
    { id: 'users', label: 'Users', path: '/admin' },
    { id: 'skills', label: 'Skills', path: '/admin/skills' },
    { id: 'swaps', label: 'Swap Requests', path: '/admin/swaps' },
    { id: 'export', label: 'Export Data', path: '/admin/export' },
  ];

  // Update active tab based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setActiveTab('users');
    } else if (path === '/admin/skills') {
      setActiveTab('skills');
    } else if (path === '/admin/swaps') {
      setActiveTab('swaps');
    } else if (path === '/admin/export') {
      setActiveTab('export');
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1>Admin Dashboard</h1>
      
      <div className="card">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Tab content */}
        <Routes>
          <Route path="/" element={<AdminUsers />} />
          <Route path="/skills" element={<AdminSkills />} />
          <Route path="/swaps" element={<AdminSwaps />} />
          <Route path="/export" element={<AdminExport />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard; 