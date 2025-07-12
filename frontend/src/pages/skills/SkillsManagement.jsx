import { useState, useEffect } from 'react';
import { skillsAPI } from '../../services/api';

const SkillsManagement = () => {
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    skill_type: 'offered',
    proficiency_level: 3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const fetchUserSkills = async () => {
    setLoading(true);
    try {
      // Fetch offered skills
      const offeredResponse = await skillsAPI.getUserSkills('offered');
      setOfferedSkills(offeredResponse.data);
      
      // Fetch wanted skills
      const wantedResponse = await skillsAPI.getUserSkills('wanted');
      setWantedSkills(wantedResponse.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: name === 'proficiency_level' ? parseInt(value) : value
    }));
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    
    if (!newSkill.skill_name.trim()) {
      setError('Please enter a skill name');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await skillsAPI.addUserSkill(newSkill);
      
      // Reset form
      setNewSkill({
        skill_name: '',
        skill_type: 'offered',
        proficiency_level: 3
      });
      
      // Refresh skills list
      await fetchUserSkills();
      
      setSuccessMessage(`Skill added successfully to your ${newSkill.skill_type} skills!`);
    } catch (error) {
      console.error('Error adding skill:', error);
      setError(error.response?.data?.detail || 'Failed to add skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await skillsAPI.deleteUserSkill(skillId);
      
      // Refresh skills list
      await fetchUserSkills();
      
      setSuccessMessage('Skill removed successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to remove skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render skill proficiency
  const renderProficiency = (level) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`h-4 w-4 ${i < level ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1>Manage Your Skills</h1>
      
      {/* Add new skill form */}
      <div className="card mb-8">
        <h2 className="mb-4">Add a New Skill</h2>
        
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
        
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label htmlFor="skill_name" className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              id="skill_name"
              name="skill_name"
              value={newSkill.skill_name}
              onChange={handleInputChange}
              className="input"
              placeholder="e.g., Programming, Cooking, Photography"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skill_type" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Type
              </label>
              <select
                id="skill_type"
                name="skill_type"
                value={newSkill.skill_type}
                onChange={handleInputChange}
                className="input"
              >
                <option value="offered">Offered (I can teach this)</option>
                <option value="wanted">Wanted (I want to learn this)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="proficiency_level" className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level {newSkill.skill_type === 'offered' ? '(Your expertise)' : '(Your current level)'}
              </label>
              <select
                id="proficiency_level"
                name="proficiency_level"
                value={newSkill.proficiency_level}
                onChange={handleInputChange}
                className="input"
              >
                <option value="1">1 - Beginner</option>
                <option value="2">2 - Elementary</option>
                <option value="3">3 - Intermediate</option>
                <option value="4">4 - Advanced</option>
                <option value="5">5 - Expert</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Skill'}
          </button>
        </form>
      </div>
      
      {/* Skills lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Offered Skills */}
        <div className="card">
          <h2 className="text-primary-600 mb-4">Skills You Offer</h2>
          
          {loading && offeredSkills.length === 0 ? (
            <p className="text-gray-500">Loading...</p>
          ) : offeredSkills.length === 0 ? (
            <p className="text-gray-500">You haven't added any offered skills yet.</p>
          ) : (
            <ul className="space-y-4">
              {offeredSkills.map((skill) => (
                <li key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{skill.skill_name}</p>
                    <div className="mt-1">{renderProficiency(skill.proficiency_level)}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Wanted Skills */}
        <div className="card">
          <h2 className="text-secondary-600 mb-4">Skills You Want to Learn</h2>
          
          {loading && wantedSkills.length === 0 ? (
            <p className="text-gray-500">Loading...</p>
          ) : wantedSkills.length === 0 ? (
            <p className="text-gray-500">You haven't added any wanted skills yet.</p>
          ) : (
            <ul className="space-y-4">
              {wantedSkills.map((skill) => (
                <li key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{skill.skill_name}</p>
                    <div className="mt-1">{renderProficiency(skill.proficiency_level)}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsManagement; 