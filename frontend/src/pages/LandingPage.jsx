import { Link } from 'react-router-dom';
import { useState } from 'react';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 text-center lg:text-left">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                  <span className="block">Share your skills,</span>
                  <span className="block text-primary-600">learn something new</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                  Skill Swap connects people who want to exchange skills and knowledge. Teach what you know, learn what you don't.
                </p>
                <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 lg:col-span-5">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Featured Skills</h3>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      {['Programming', 'Languages', 'Music', 'Cooking', 'Photography', 'Design'].map((skill) => (
                        <div key={skill} className="bg-primary-50 rounded-md p-3 text-center">
                          <span className="text-primary-700 font-medium">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['about', 'features', 'database'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab === 'database' ? 'PostgreSQL Integration' : tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'about' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900">About Skill Swap</h2>
              <p>
                Skill Swap is a platform that connects people who want to exchange skills and knowledge. 
                Whether you're looking to learn a new language, improve your coding skills, or master the art of cooking, 
                Skill Swap makes it easy to find someone who can teach you in exchange for your own expertise.
              </p>
              <p>
                Our mission is to create a community where knowledge flows freely and everyone has the opportunity to both teach and learn.
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Profile Management',
                    description: 'Create your profile with skills you offer and skills you want to learn.',
                    icon: '👤'
                  },
                  {
                    title: 'Skill Search',
                    description: 'Find users offering the skills you want to learn.',
                    icon: '🔍'
                  },
                  {
                    title: 'Swap Requests',
                    description: 'Send, accept, or reject skill swap requests.',
                    icon: '🔄'
                  },
                  {
                    title: 'Feedback System',
                    description: 'Rate and review your skill swap experiences.',
                    icon: '⭐'
                  },
                  {
                    title: 'User Dashboard',
                    description: 'Manage all your skill swaps in one place.',
                    icon: '📊'
                  },
                  {
                    title: 'Secure Authentication',
                    description: 'JWT-based authentication for secure access.',
                    icon: '🔒'
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900">PostgreSQL Integration</h2>
              <p>
                Skill Swap is powered by PostgreSQL, a powerful, open-source object-relational database system.
                This provides several benefits for our platform:
              </p>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Scalability:</strong> Handles growing user base and data efficiently</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Data Integrity:</strong> Ensures your skill swap data is accurate and consistent</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Performance:</strong> Fast queries for smooth user experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Reliability:</strong> Enterprise-grade database technology</span>
                </li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-md mt-6">
                <h3 className="text-lg font-medium text-gray-900">Deployment Options</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Skill Swap supports multiple PostgreSQL deployment options:
                </p>
                <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>Local PostgreSQL installation</li>
                  <li>Cloud-based PostgreSQL (ElephantSQL, Heroku Postgres)</li>
                  <li>Docker containerized deployment</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">
                  Check our documentation for detailed setup instructions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How Skill Swap Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Exchange skills in three simple steps
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Your Profile',
                  description: 'Add skills you can teach and skills you want to learn.'
                },
                {
                  step: '02',
                  title: 'Find a Match',
                  description: 'Search for users who offer what you want to learn and need what you can teach.'
                },
                {
                  step: '03',
                  title: 'Start Swapping',
                  description: 'Send a swap request and start learning from each other.'
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute h-12 w-12 rounded-md bg-primary-500 text-white flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div className="pl-16">
                    <h3 className="text-xl font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start swapping skills?</span>
            <span className="block text-primary-200">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 