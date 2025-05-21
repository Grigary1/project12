import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./../hooks/useHooks";
import axios from 'axios'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const { isAuthenticated, role, logout } = useAuth();

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/table", label: "User Table" },
        { path: "/addDetails", label: "Add Details", adminOnly: true },
    ];

    const handleNavClick = (path, adminOnly = false) => {
        if (adminOnly) {
            if (!isAuthenticated || role !== "admin") {
                setShowLoginModal(true);
                return;
            }
        }
        window.location.href = path;
    };

    return (
        <nav className="bg-white dark:bg-blue-300 shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        Project
                    </Link>

                    <div className="hidden md:flex gap-6">
                        {navLinks.map(({ path, label, adminOnly }) => (
                            <button
                                key={label}
                                onClick={() => handleNavClick(path, adminOnly)}
                                className={`text-sm font-medium transition ${window.location.pathname === path
                                        ? "text-blue-600 underline"
                                        : "text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-white"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Welcome</span>
                                <button onClick={logout} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-gray-300 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile nav links */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4">
                    <div className="flex flex-col gap-4">
                        {navLinks.map(({ path, label, adminOnly }) => (
                            <button
                                key={label}
                                onClick={() => {
                                    handleNavClick(path, adminOnly);
                                    setIsOpen(false);
                                }}
                                className="text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-white"
                            >
                                {label}
                            </button>
                        ))}
                        {isAuthenticated ? (
                            <button onClick={() => { logout(); setIsOpen(false); }} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Login Required Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-2">Admin Login</h2>
                        <p className="text-gray-600 mb-4">You must log in as admin to access this page.</p>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target;
                                const username = form.username.value;
                                const password = form.password.value;

                                try {
                                    const res = await fetch("/api/admin/login", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ username, password }),
                                    });

                                    if (res.ok) {
                                        // Optionally update auth state
                                        window.location.reload(); // or use navigate('/addDetails')
                                    } else {
                                        alert("Invalid admin credentials");
                                    }
                                } catch (err) {
                                    console.error("Login error:", err);
                                    alert("Login failed. Try again.");
                                }
                            }}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                name="username"
                                placeholder="Admin Username"
                                className="border px-3 py-2 rounded w-full"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="border px-3 py-2 rounded w-full"
                                required
                            />

                            <div className="flex justify-center gap-4 mt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLoginModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </nav>
    );
}
