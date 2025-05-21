import React, { useContext, useMemo } from 'react';
import { UserDataContext } from '../context/UserDataContext.jsx';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#FBBF24', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function Stats() {
  const { users } = useContext(UserDataContext);

  // Compute statistics
  const genderData = useMemo(() => {
    const counts = users.reduce((acc, { gender }) => {
      if (!gender) return acc;
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const placeData = useMemo(() => {
    const counts = users.reduce((acc, { place }) => {
      if (!place) return acc;
      acc[place] = (acc[place] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const hobbyData = useMemo(() => {
    const counts = users.reduce((acc, { hobbies }) => {
      hobbies?.forEach(h => {
        acc[h] = (acc[h] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Statistics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={genderData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {genderData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Users per Place */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Users by Place</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hobbies Popularity */}
        <div className="bg-white p-4 rounded-2xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Hobbies Popularity</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={hobbyData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600">{users.length}</span>
          <span className="text-gray-600 mt-1">Total Users</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
          <span className="text-3xl font-bold text-green-600">{genderData.reduce((a, c) => a + c.value, 0)}</span>
          <span className="text-gray-600 mt-1">Gender Data Points</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-600">{hobbyData.length}</span>
          <span className="text-gray-600 mt-1">Unique Hobbies</span>
        </div>
      </div>
    </div>
  );
}