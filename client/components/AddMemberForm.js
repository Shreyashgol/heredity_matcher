'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AddMemberForm({ onMemberAdded, people }) {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    gender: 'Male',
  });

  const [relationshipData, setRelationshipData] = useState({
    parent_id: '',
    child_id: '',
    type: 'Father',
  });

  const [conditionData, setConditionData] = useState({
    person_id: '',
    condition_name: '',
    diagnosed_date: '',
  });

  const [activeTab, setActiveTab] = useState('person');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAddPerson = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated. Please login.' });
        return;
      }

      await axios.post(`${API_URL}/person`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Person added successfully!' });
      setFormData({ name: '', birth_date: '', gender: 'Male' });
      onMemberAdded();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to add person' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelationship = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated. Please login.' });
        return;
      }

      await axios.post(`${API_URL}/relationship`, {
        parent_id: parseInt(relationshipData.parent_id),
        child_id: parseInt(relationshipData.child_id),
        type: relationshipData.type,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Relationship added successfully!' });
      setRelationshipData({ parent_id: '', child_id: '', type: 'Father' });
      onMemberAdded();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to add relationship' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCondition = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated. Please login.' });
        return;
      }

      await axios.post(`${API_URL}/condition`, {
        person_id: parseInt(conditionData.person_id),
        condition_name: conditionData.condition_name,
        diagnosed_date: conditionData.diagnosed_date,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Condition added successfully!' });
      setConditionData({ person_id: '', condition_name: '', diagnosed_date: '' });
      onMemberAdded();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to add condition' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('person')}
          className={`pb-2 px-4 font-semibold transition-colors ${
            activeTab === 'person'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Add Person
        </button>
        <button
          onClick={() => setActiveTab('relationship')}
          className={`pb-2 px-4 font-semibold transition-colors ${
            activeTab === 'relationship'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Add Relationship
        </button>
        <button
          onClick={() => setActiveTab('condition')}
          className={`pb-2 px-4 font-semibold transition-colors ${
            activeTab === 'condition'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Add Condition
        </button>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add Person Form */}
      {activeTab === 'person' && (
        <form onSubmit={handleAddPerson} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
          >
            {loading ? 'Adding...' : 'Add Person'}
          </button>
        </form>
      )}

      {/* Add Relationship Form */}
      {activeTab === 'relationship' && (
        <form onSubmit={handleAddRelationship} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
            <select
              value={relationshipData.parent_id}
              onChange={(e) => setRelationshipData({ ...relationshipData, parent_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select Parent</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
            <select
              value={relationshipData.child_id}
              onChange={(e) => setRelationshipData({ ...relationshipData, child_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select Child</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Type</label>
            <select
              value={relationshipData.type}
              onChange={(e) => setRelationshipData({ ...relationshipData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold"
          >
            {loading ? 'Adding...' : 'Add Relationship'}
          </button>
        </form>
      )}

      {/* Add Condition Form */}
      {activeTab === 'condition' && (
        <form onSubmit={handleAddCondition} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
            <select
              value={conditionData.person_id}
              onChange={(e) => setConditionData({ ...conditionData, person_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select Person</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition Name</label>
            <input
              type="text"
              value={conditionData.condition_name}
              onChange={(e) => setConditionData({ ...conditionData, condition_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="e.g., Diabetes, Glaucoma"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
            <input
              type="date"
              value={conditionData.diagnosed_date}
              onChange={(e) => setConditionData({ ...conditionData, diagnosed_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors font-semibold"
          >
            {loading ? 'Adding...' : 'Add Condition'}
          </button>
        </form>
      )}
    </div>
  );
}
