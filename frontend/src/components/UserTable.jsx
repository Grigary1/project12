import { useContext, useState, useMemo } from "react";
import { UserDataContext } from "../context/UserDataContext.jsx";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserTable() {
    const { users, fetchUsers, loading } = useContext(UserDataContext);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
//filter states
    const [filters, setFilters] = useState({
        textSearch: { field: 'name', operator: 'contains', value: '' },
        exactMatches: { gender: '', place: '' },
        hobbies: { values: [], matchType: 'any' },
        phone: { number: '', field: 'phone1', matchType: 'contains' },
        advanced: [],
        globalSearch: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filterOptions = useMemo(() => ({
        genders: [...new Set(users.map(u => u.gender))].filter(Boolean),
        places: [...new Set(users.map(u => u.place))].filter(Boolean),
        hobbies: [...new Set(users.flatMap(u => u.hobbies))].filter(Boolean)
    }), [users]);
//memoization
    const filteredUsers = useMemo(() => users.filter(user => {
        if (filters.globalSearch) {
            const searchStr = Object.values(user).join(' ').toLowerCase();
            if (!searchStr.includes(filters.globalSearch.toLowerCase())) return false;
        }

        const textFilter = filters.textSearch;
        if (textFilter.value) {
            let fieldValue = (user[textFilter.field] || '').toString().toLowerCase();
            const searchValue = textFilter.value.toLowerCase();
            
            switch (textFilter.operator) {
                case 'contains': if (!fieldValue.includes(searchValue)) return false; break;
                case 'startsWith': if (!fieldValue.startsWith(searchValue)) return false; break;
                case 'equals': if (fieldValue !== searchValue) return false; break;
            }
        }

        if (filters.exactMatches.gender && user.gender !== filters.exactMatches.gender) return false;
        if (filters.exactMatches.place && user.place !== filters.exactMatches.place) return false;

        if (filters.hobbies.values.length > 0) {
            const hasAll = filters.hobbies.values.every(h => user.hobbies.includes(h));
            const hasAny = filters.hobbies.values.some(h => user.hobbies.includes(h));
            if (filters.hobbies.matchType === 'all' && !hasAll) return false;
            if (filters.hobbies.matchType === 'any' && !hasAny) return false;
        }

        if (filters.phone.number) {
            const phone = (user[filters.phone.field] || '').replace(/\D/g, '');
            const searchNum = filters.phone.number.replace(/\D/g, '');
            switch (filters.phone.matchType) {
                case 'contains': if (!phone.includes(searchNum)) return false; break;
                case 'startsWith': if (!phone.startsWith(searchNum)) return false; break;
                case 'endsWith': if (!phone.endsWith(searchNum)) return false; break;
                case 'equals': if (phone !== searchNum) return false; break;
            }
        }

        return true;
    }), [users, filters]);

    const sortedUsers = useMemo(() => {
        if (!sortConfig.field) return filteredUsers;

        return [...filteredUsers].sort((a, b) => {
            const aValue = a[sortConfig.field]?.toString().toLowerCase() || '';
            const bValue = b[sortConfig.field]?.toString().toLowerCase() || '';

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredUsers, sortConfig]);
//pagination
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedUsers.slice(start, start + itemsPerPage);
    }, [sortedUsers, currentPage]);

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIndicator = (field) => {
        if (sortConfig.field !== field) return '↕';
        return sortConfig.direction === 'asc' ? 'Ascending (sorted)' : 'Descending (sorted)';
    };

    const handleDelete = async (userIds) => {
        const confirm = window.confirm(
            Array.isArray(userIds)
                ? `Really wants to dlt ${userIds.length} users?`
                : "Are you sure you want to delete this user?"
        );
        if (!confirm) return;

        const toastId = toast.loading('Deleting user(s)');
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/deletedata`,
                { ids: Array.isArray(userIds) ? userIds : [userIds] },
                { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
            );
            toast.update(toastId, {
                render: 'User(s) deleted successfully',
                type: 'success',
                isLoading: false,
                autoClose: 5000
            });
            setSelectedUsers([]);
            fetchUsers();
        } catch (error) {
            toast.update(toastId, {
                render: 'Failed to delete user(s)',
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
            console.error("Error deleting user(s):", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        const pageUserIds = paginatedUsers.map(u => u._id);
        const allSelected = pageUserIds.every(id => selectedUsers.includes(id));
        if (allSelected) {
            setSelectedUsers(prev => prev.filter(id => !pageUserIds.includes(id)));
        } else {
            setSelectedUsers(prev => [...new Set([...prev, ...pageUserIds])]);
        }
    };

    const renderPagination = () => {
        const maxPagesToShow = 7;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
        startPage = Math.max(1, endPage - maxPagesToShow + 1);

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex justify-center gap-2 mt-6">
                {currentPage > 1 && (
                    <button 
                        onClick={() => setCurrentPage(prev => prev - 1)} 
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Prev
                    </button>
                )}
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded transition ${
                            page === currentPage 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button 
                        onClick={() => setCurrentPage(prev => prev + 1)} 
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Next
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6">
            <ToastContainer position="bottom-right" autoClose={5000} />
            
            {/* all filter sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* search section (for all kid of search) */}
                <div className="bg-white p-4 rounded-xl shadow-md border">
                    <label className="block font-medium mb-2 text-gray-700">Global Search</label>
                    <input
                        type="text"
                        value={filters.globalSearch}
                        onChange={e => setFilters(prev => ({
                            ...prev,
                            globalSearch: e.target.value
                        }))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search all fields"
                    />
                </div>

                {/* txt filter */}
                <div className="bg-white p-4 rounded-xl shadow-md border">
                    <label className="block font-medium mb-2 text-gray-700">Text Filter</label>
                    <div className="flex gap-2 mb-2">
                        <select
                            value={filters.textSearch.field}
                            onChange={e => setFilters(prev => ({
                                ...prev,
                                textSearch: { ...prev.textSearch, field: e.target.value }
                            }))}
                            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="place">Place</option>
                        </select>
                        <select
                            value={filters.textSearch.operator}
                            onChange={e => setFilters(prev => ({
                                ...prev,
                                textSearch: { ...prev.textSearch, operator: e.target.value }
                            }))}
                            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="contains">Contains</option>
                            <option value="startsWith">Starts With</option>
                            <option value="equals">Equals</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        value={filters.textSearch.value}
                        onChange={e => setFilters(prev => ({
                            ...prev,
                            textSearch: { ...prev.textSearch, value: e.target.value }
                        }))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter value"
                    />
                </div>

                {/* gender filter */}
                <div className="bg-white p-4 rounded-xl shadow-md border">
                    <label className="block font-medium mb-2 text-gray-700">Gender</label>
                    <select
                        value={filters.exactMatches.gender}
                        onChange={e => setFilters(prev => ({
                            ...prev,
                            exactMatches: { ...prev.exactMatches, gender: e.target.value }
                        }))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Genders</option>
                        {filterOptions.genders.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                </div>

                {/* phone filter*/}
                <div className="bg-white p-4 rounded-xl shadow-md border">
                    <label className="block font-medium mb-2 text-gray-700">Phone Filter</label>
                    <div className="flex gap-2 mb-2">
                        <select
                            value={filters.phone.field}
                            onChange={e => setFilters(prev => ({
                                ...prev,
                                phone: { ...prev.phone, field: e.target.value }
                            }))}
                            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="phone1">Phone 1</option>
                            <option value="phone2">Phone 2</option>
                        </select>
                        <select
                            value={filters.phone.matchType}
                            onChange={e => setFilters(prev => ({
                                ...prev,
                                phone: { ...prev.phone, matchType: e.target.value }
                            }))}
                            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="contains">Contains</option>
                            <option value="startsWith">Starts With</option>
                            <option value="endsWith">Ends With</option>
                            <option value="equals">Exact Match</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        value={filters.phone.number}
                        onChange={e => setFilters(prev => ({
                            ...prev,
                            phone: { ...prev.phone, number: e.target.value }
                        }))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                    />
                </div>
            </div>

            {/* table content */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 text-gray-700 text-sm">
                        <tr>
                            {localStorage.getItem("adminToken") && (
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        onChange={toggleSelectAll}
                                        checked={
                                            paginatedUsers.length > 0 &&
                                            paginatedUsers.every(u => selectedUsers.includes(u._id))
                                        }
                                        className="w-4 h-4 accent-blue-500"
                                    />
                                </th>
                            )}
                            <th 
                                className="p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-2">
                                    Name
                                    <span className="text-blue-600 font-medium">
                                        {getSortIndicator('name')}
                                    </span>
                                </div>
                            </th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone 1</th>
                            <th className="p-4">Phone 2</th>
                            <th className="p-4">Hobbies</th>
                            <th 
                                className="p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('place')}
                            >
                                <div className="flex items-center gap-2">
                                    Place
                                    <span className="text-blue-600 font-medium">
                                        {getSortIndicator('place')}
                                    </span>
                                </div>
                            </th>
                            <th 
                                className="p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('gender')}
                            >
                                <div className="flex items-center gap-2">
                                    Gender
                                    <span className="text-blue-600 font-medium">
                                        {getSortIndicator('gender')}
                                    </span>
                                </div>
                            </th>
                            {localStorage.getItem("adminToken") && <th className="p-4">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={localStorage.getItem("adminToken") ? 9 : 7} className="p-4 text-center">
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        <span className="ml-2 text-gray-600">Loading users...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : sortedUsers.length > 0 ? (
                            paginatedUsers.map(user => (
                                <tr key={user._id} className="border-t hover:bg-gray-50">
                                    {localStorage.getItem("adminToken") && (
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => toggleUserSelection(user._id)}
                                                className="w-4 h-4 accent-blue-500"
                                            />
                                        </td>
                                    )}
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.phone1}</td>
                                    <td className="p-4">{user.phone2 || '-'}</td>
                                    <td className="p-4 max-w-[200px]">{user.hobbies.join(", ")}</td>
                                    <td className="p-4">{user.place}</td>
                                    <td className="p-4">{user.gender}</td>
                                    {localStorage.getItem("adminToken") && (
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={localStorage.getItem("adminToken") ? 9 : 7} className="p-4 text-center text-gray-500">
                                    No users found with the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {localStorage.getItem("adminToken") && selectedUsers.length > 0 && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => handleDelete(selectedUsers)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Delete Selected ({selectedUsers.length})
                    </button>
                </div>
            )}

            {renderPagination()}
        </div>
    );
}   