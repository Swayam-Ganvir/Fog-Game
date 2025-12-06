"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    Activity,
    Settings,
    Shield,
    BarChart3,
    SearchIcon,
    Eye,
    Ban,
    Play,
    Pause,
    RefreshCw,
    Search,
    Filter,
    Download,
    Globe,
    UserCheck,
    LogOut,
    AlertTriangle,
} from 'lucide-react';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, username }) {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
                    <p className="mt-2 text-gray-600">
                        Are you sure you want to delete the user{" "}
                        <strong className="text-red-600">{username}</strong>? This action is
                        irreversible.
                    </p>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg"
                    >
                        Confirm Delete
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

// ✨ 1. New Modal component for Logout Confirmation
function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
                    <p className="mt-2 text-gray-600">
                        Are you sure you want to log out from the Admin Panel?
                    </p>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg"
                    >
                        Logout
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}


const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([])
    const [totalDistance, setTotalDistance] = useState(0)
    const [loading, setLoading] = useState(true);
    const [userToDelete, setUserToDelete] = useState(null);
    // ✨ 2. State to manage the logout confirmation modal
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!loading) {
            const fetchUsers = async () => {
                try {
                    const res = await axios.get('https://fog-game.onrender.com/api/admin/allUsers', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                        },
                    });
                    if (res.data.success) {
                        const allUsers = res.data.data;
                        setUsers(allUsers);
                        const distanceSum = allUsers.reduce((sum, player) => sum + (player.stats?.distanceTravelled || 0), 0);
                        setTotalDistance(distanceSum);
                    }
                } catch (error) {
                    console.error("Error fetching users : ", error);
                    router.push("/admin/login");
                }
            };
            fetchUsers();
        }
    }, [loading, router]);

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await axios.delete(`https://fog-game.onrender.com/api/admin/deleteUser/${userToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });
            setUsers((prev) => prev.filter((u) => u._id !== userToDelete.id));
        } catch (error) {
            console.error("Error deleting user : ", error);
        } finally {
            setUserToDelete(null);
        }
    };

    const handleViewProfile = (userId) => {
        router.push(`/admin/playerDetails/${userId}`);
    };

    // ✨ 3. Renamed function to handle the final logout action
    const handleConfirmLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Checking admin authentication...
            </div>
        );
    }

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Players</p>
                            <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.isOnline).length}</p>
                        </div>
                        <Users className="h-12 w-12 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <UserCheck className="h-12 w-12 text-purple-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Distance Travelled</p>
                            <p className="text-3xl font-bold text-gray-900">{totalDistance.toLocaleString()} m</p>
                        </div>
                        <BarChart3 className="h-12 w-12 text-red-600" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Player Activity</h3>
                </div>
                <div className="overflow-auto max-h-96">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance Travelled</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((player) => (
                                <tr
                                    key={player._id}
                                    onClick={() => handleViewProfile(player._id)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {player.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${player.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {player.isOnline ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {player.lastLogin
                                            ? new Date(player.lastLogin).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {player.stats?.distanceTravelled || 0} m
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderPlayerManagement = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search players..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-auto max-h-[500px]">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.filter(player =>
                                player.username.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((player) => (
                                <tr
                                    key={player._id}
                                    onClick={() => handleViewProfile(player._id)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${player.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{player.isOnline ? 'Online' : 'Offline'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.createdAt ? new Date(player.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.lastLogin ? new Date(player.lastLogin).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900" onClick={(e) => { e.stopPropagation(); handleViewProfile(player._id); }}><Eye className="w-4 h-4" /></button>
                                            <button className="text-red-600 hover:text-red-900" onClick={(e) => { e.stopPropagation(); setUserToDelete({ id: player._id, username: player.username }); }}><Ban className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'players', label: 'Players', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <DeleteConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDeleteUser}
                username={userToDelete?.username}
            />
            {/* ✨ 5. Render the new logout confirmation modal */}
            <LogoutConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />

            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-xl font-semibold text-gray-900">Fog of War - Admin Panel</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            
                            {/* ✨ 4. Logout button now opens the modal */}
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'players' && renderPlayerManagement()}
            </div>
        </div>
    );
};

export default AdminPanel;