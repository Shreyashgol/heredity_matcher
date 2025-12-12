'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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

  const handleAddPerson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/person`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Person added successfully!');
      setFormData({ name: '', birth_date: '', gender: 'Male' });
      onMemberAdded();
    } catch (error) {
      alert('Failed to add person');
      console.error(error);
    }
  };

  const handleAddRelationship = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/relationship`, {
        parent_id: parseInt(relationshipData.parent_id),
        child_id: parseInt(relationshipData.child_id),
        type: relationshipData.type,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Relationship added successfully!');
      setRelationshipData({ parent_id: '', child_id: '', type: 'Father' });
      onMemberAdded();
    } catch (error) {
      alert('Failed to add relationship');
      console.error(error);
    }
  };

  const handleAddCondition = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/condition`, {
        person_id: parseInt(conditionData.person_id),
        condition_name: conditionData.condition_name,
        diagnosed_date: conditionData.diagnosed_date,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Condition added successfully!');
      setConditionData({ person_id: '', condition_name: '', diagnosed_date: '' });
      onMemberAdded();
    } catch (error) {
      alert('Failed to add condition');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('person')}
          className={`pb-2 px-4 ${
            activeTab === 'person'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600'
          }`}
        >
          Add Person
        </button>
        <button
          onClick={() => setActiveTab('relationship')}
          className={`pb-2 px-4 ${
            activeTab === 'relationship'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600'
          }`}
        >
          Add Relationship
        </button>
        <button
          onClick={() => setActiveTab('condition')}
          className={`pb-2 px-4 ${
            activeTab === 'condition'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600'
          }`}
        >
          Add Condition
        </button>
      </div>

      {activeTab === 'person' && (
        <form onSubmit={handleAddPerson} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Person
          </button>
        </form>
      )}

      {activeTab === 'relationship' && (
        <form onSubmit={handleAddRelationship} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
            <select
              value={relationshipData.parent_id}
              onChange={(e) => setRelationshipData({ ...relationshipData, parent_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Add Relationship
          </button>
        </form>
      )}

      {activeTab === 'condition' && (
        <form onSubmit={handleAddCondition} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
            <select
              value={conditionData.person_id}
              onChange={(e) => setConditionData({ ...conditionData, person_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Add Condition
          </button>
        </form>
      )}
    </div>
  );
}
