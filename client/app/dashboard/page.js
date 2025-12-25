'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import FamilyTreeGraph from '@/components/FamilyTreeGraph';
import AddMemberForm from '@/components/AddMemberForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function Dashboard() {
  const router = useRouter();
  
  const [people, setPeople] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tree');
  
  // Risk calculation state
  const [riskCondition, setRiskCondition] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [riskError, setRiskError] = useState(null);

  // Edit/Delete state
  const [editingPerson, setEditingPerson] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', birth_date: '', gender: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/people`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPeople(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedPerson(response.data.data[0]);
          fetchFamilyTree(response.data.data[0].id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch people');
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyTree = async (personId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/tree/${personId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTreeData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching family tree:', err);
    }
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    fetchFamilyTree(person.id);
    setRiskCondition('');
    setRiskError(null);
  };

  const handleCalculateRisk = async () => {
    if (!selectedPerson || !riskCondition.trim()) {
      setRiskError('Please select a person and enter a condition name');
      return;
    }

    setCalculating(true);
    setRiskError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_URL}/risk/${selectedPerson.id}/${encodeURIComponent(riskCondition)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Store report data in session storage
        const reportData = {
          personId: selectedPerson.id,
          patientName: response.data.data.patientName,
          condition: response.data.data.condition,
          totalRisk: response.data.data.totalRisk,
          riskLevel: response.data.data.riskLevel,
          affectedAncestors: response.data.data.affectedAncestors,
          aiReport: response.data.data.aiReport,
          generatedAt: response.data.data.generatedAt
        };

        sessionStorage.setItem('riskReport', JSON.stringify(reportData));
        
        // Navigate to report page
        router.push('/dashboard/report');
      } else {
        setRiskError(response.data.error || 'Failed to calculate risk');
      }
    } catch (err) {
      console.error('Error calculating risk:', err);
      setRiskError(err.response?.data?.error || 'Failed to calculate risk');
    } finally {
      setCalculating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setEditFormData({
      name: person.name,
      birth_date: person.birth_date,
      gender: person.gender
    });
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setEditFormData({ name: '', birth_date: '', gender: '' });
  };

  const handleSaveEdit = async () => {
    if (!editFormData.name || !editFormData.birth_date || !editFormData.gender) {
      setError('All fields are required');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_URL}/person/${editingPerson.id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccessMessage('Person updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setEditingPerson(null);
        fetchPeople();
        
        // Update selected person if it was the one being edited
        if (selectedPerson?.id === editingPerson.id) {
          setSelectedPerson(response.data.data);
          fetchFamilyTree(response.data.data.id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update person');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePerson = (person) => {
    setDeleteConfirm(person);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setActionLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `${API_URL}/person/${deleteConfirm.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccessMessage('Person deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setDeleteConfirm(null);
        
        // Clear selected person if it was deleted
        if (selectedPerson?.id === deleteConfirm.id) {
          setSelectedPerson(null);
          setTreeData(null);
        }
        
        fetchPeople();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete person');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧬</span>
            <h1 className="text-2xl font-bold text-indigo-900">Heredity</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Family Members</h2>
              
              {people.length === 0 ? (
                <p className="text-gray-600 text-sm mb-4">No family members added yet.</p>
              ) : (
                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {people.map((person) => (
                    <div
                      key={person.id}
                      className={`rounded-lg border-2 transition-all ${
                        selectedPerson?.id === person.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {editingPerson?.id === person.id ? (
                        // Edit Mode
                        <div className="p-3 space-y-2">
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black"
                            placeholder="Name"
                          />
                          <input
                            type="date"
                            value={editFormData.birth_date}
                            onChange={(e) => setEditFormData({ ...editFormData, birth_date: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black"
                          />
                          <select
                            value={editFormData.gender}
                            onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={actionLoading}
                              className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                            >
                              {actionLoading ? '...' : '✓ Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={actionLoading}
                              className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:bg-gray-400"
                            >
                              ✗ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-center justify-between p-3">
                          <button
                            onClick={() => handlePersonSelect(person)}
                            className="flex-1 text-left"
                          >
                            <p className="font-semibold text-gray-900">{person.name}</p>
                            <p className="text-xs text-gray-600">{person.gender} • {new Date(person.birth_date).toLocaleDateString()}</p>
                          </button>
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => handleEditPerson(person)}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeletePerson(person)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Risk Calculation Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Calculate Risk</h3>
                
                {riskError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                    {riskError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition Name
                    </label>
                    <input
                      type="text"
                      value={riskCondition}
                      onChange={(e) => setRiskCondition(e.target.value)}
                      placeholder="e.g., Diabetes, Heart Disease"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                  </div>

                  <button
                    onClick={handleCalculateRisk}
                    disabled={calculating || !selectedPerson}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors font-semibold"
                  >
                    {calculating ? 'Calculating...' : '📊 Calculate Risk'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('tree')}
                className={`pb-2 px-4 font-semibold transition-colors ${
                  activeTab === 'tree'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Family Tree
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`pb-2 px-4 font-semibold transition-colors ${
                  activeTab === 'add'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Add Member
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'tree' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {selectedPerson && treeData ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedPerson.name}'s Family Tree
                    </h2>
                    <FamilyTreeGraph treeData={treeData} />
                  </>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    Select a family member to view their family tree
                  </p>
                )}
              </div>
            )}

            {activeTab === 'add' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <AddMemberForm onMemberAdded={fetchPeople} people={people} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Family Member</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
              This will remove all their relationships and conditions from the family tree.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-semibold"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={handleCancelDelete}
                disabled={actionLoading}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
