'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import FamilyTreeGraph from '@/components/FamilyTreeGraph';
import AddMemberForm from '@/components/AddMemberForm';

const API_URL = 'http://localhost:3000/api';

export default function Dashboard() {
  const router = useRouter();
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [conditionToCheck, setConditionToCheck] = useState('Diabetes');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  // Fetch all people
  const fetchPeople = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/people`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPeople(response.data.data);
    } catch (error) {
      console.error('Error fetching people:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
  };

  // Fetch family tree for selected person
  const fetchFamilyTree = async (personId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tree/${personId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTreeData(response.data.data);
    } catch (error) {
      console.error('Error fetching family tree:', error);
    }
  };

  // Calculate risk for selected person
  const calculateRisk = async () => {
    if (!selectedPerson || !conditionToCheck) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/risk/${selectedPerson}/${conditionToCheck}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRiskData(response.data.data);
    } catch (error) {
      console.error('Error calculating risk:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  useEffect(() => {
    if (!loading) {
      fetchPeople();
    }
  }, [loading]);

  useEffect(() => {
    if (selectedPerson) {
      fetchFamilyTree(selectedPerson);
      setRiskData(null);
    }
  }, [selectedPerson]);

  const handleMemberAdded = () => {
    fetchPeople();
    if (selectedPerson) {
      fetchFamilyTree(selectedPerson);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-indigo-900 mb-2 flex items-center">
              <span className="mr-2">🧬</span> Heredity
            </h1>
            <p className="text-xl text-gray-700">
              Welcome back, {user?.name}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Forms */}
          <div className="lg:col-span-1">
            <AddMemberForm onMemberAdded={handleMemberAdded} people={people} />
            
            {/* Person Selector */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Select Person to View Tree
              </h3>
              <select
                value={selectedPerson || ''}
                onChange={(e) => setSelectedPerson(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a person</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Calculator */}
            {selectedPerson && (
              <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Calculate Genetic Risk
                </h3>
                <input
                  type="text"
                  value={conditionToCheck}
                  onChange={(e) => setConditionToCheck(e.target.value)}
                  placeholder="Enter condition name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <button
                  onClick={calculateRisk}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Calculate Risk
                </button>

                {riskData && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Risk Assessment for {riskData.condition}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Risk:</span>
                        <span className="font-bold text-lg">{riskData.totalRisk}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span
                          className={`font-bold ${
                            riskData.riskLevel === 'High'
                              ? 'text-red-600'
                              : riskData.riskLevel === 'Medium'
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {riskData.riskLevel}
                        </span>
                      </div>
                      {riskData.affectedAncestors.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            Affected Ancestors:
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {riskData.affectedAncestors.map((ancestor, idx) => (
                              <li key={idx}>
                                • {ancestor.name} (Gen {ancestor.generation}): {ancestor.risk}%
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Family Tree Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Family Tree Visualization
              </h2>
              {selectedPerson ? (
                <FamilyTreeGraph treeData={treeData} />
              ) : (
                <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-lg">
                    Select a person to view their family tree
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Built with Next.js, PostgreSQL Recursive CTEs, and React Flow
          </p>
        </footer>
      </div>
    </div>
  );
}
