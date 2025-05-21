import { useUserData } from "../context/UserDataContext";

export default function UserTable() {
    const { users, setUsers, fetchUsers } = useUserData();
    const isAdmin = !!localStorage.getItem("adminToken");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`${backendUrl}/api/deletedata/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete user");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">User Data</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone 1</th>
                            <th className="p-2 border">Phone 2</th>
                            <th className="p-2 border">Hobbies</th>
                            <th className="p-2 border">Place</th>
                            <th className="p-2 border">Gender</th>
                            {isAdmin && <th className="p-2 border">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="text-center">
                                <td className="p-2 border">{user.name ?? "null"}</td>
                                <td className="p-2 border">{user.email ?? "null"}</td>
                                <td className="p-2 border">{user.phone1 ?? "null"}</td>
                                <td className="p-2 border">{user.phone2 ?? "null"}</td>
                                <td className="p-2 border">
                                    {user.hobbies?.length ? user.hobbies.join(", ") : "null"}
                                </td>
                                <td className="p-2 border">{user.place ?? "null"}</td>
                                <td className="p-2 border">{user.gender ?? "null"}</td>
                                {isAdmin && (
                                    <td className="p-2 border">
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
