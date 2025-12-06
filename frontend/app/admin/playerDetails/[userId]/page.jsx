"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  Trash2,
  User,
  MapPin,
  Activity,
  Package,
  Zap,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "sonner";

// --- Reusable UI Components ---
const Badge = ({ children, color = "bg-blue-100 text-blue-800" }) => (
  <span
    className={`px-3 py-1 text-sm font-medium leading-5 rounded-full ${color}`}
  >
    {children}
  </span>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

// --- Confirmation Modal ---
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, username }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 backdrop-blur z-50 flex justify-center items-center"
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

// --- Main Page Component ---
export default function PlayerDetails() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/admin/user/${userId}`
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/deleteUser/${userId}`);
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      router.push("/admin");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50 p-6 rounded-2xl gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Skeleton className="h-10 w-full sm:w-24 rounded-lg" />
              <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 overflow-y-auto">
      <Toaster position="top-center" richColors />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 p-6 rounded-2xl shadow-md"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* User Info */}
          <div className="flex items-center gap-4">
            <User className="w-10 h-10 text-blue-500 flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <motion.button
              onClick={() => setIsDeleteModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-md"
            >
              <Trash2 size={18} /> Delete
            </motion.button>
            <motion.button
              onClick={() => router.push(`/user/userProfile/${userId}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-md"
            >
              <User size={18} /> View Profile
            </motion.button>
          </div>
        </motion.div>

        {/* Player Info */}
        <motion.div
          className="bg-gray-50 p-6 rounded-2xl shadow-md"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Activity className="text-green-500" /> Player Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <InfoItem label="Role" value={user.role} />
            <InfoItem
              label="Status"
              value={user.isOnline ? "🟢 Online" : "🔴 Offline"}
            />
            <InfoItem
              label="Created At"
              value={new Date(user.createdAt).toLocaleString()}
            />
            <InfoItem
              label="Updated At"
              value={new Date(user.updatedAt).toLocaleString()}
            />
            <InfoItem
              label="Last Login"
              value={new Date(user.lastLogin).toLocaleString()}
            />
          </div>
        </motion.div>

        {/* Stats */}
        {user.stats && (
          <motion.div
            className="bg-gray-50 p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <InfoItem
              label="Distance Travelled"
              value={`${user.stats.distanceTravelled} km`}
            />
            <InfoItem
              label="Total Checkpoints"
              value={user.stats.totalCheckpoints}
            />
            <InfoItem
              label="Time Played"
              value={`${user.stats.timePlayed} sec`}
            />
          </motion.div>
        )}

        {/* PowerUps & Inventory */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-50 p-6 rounded-2xl shadow-md"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Zap className="text-yellow-500" /> Power Ups
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.powerUps?.length > 0 ? (
                user.powerUps.map((item, idx) => (
                  <Badge key={idx} color="bg-yellow-100 text-yellow-800">
                    {item}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">No power-ups</p>
              )}
            </div>
          </motion.div>
          <motion.div
            className="bg-gray-50 p-6 rounded-2xl shadow-md"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Package className="text-pink-500" /> Inventory
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.inventory?.length > 0 ? (
                user.inventory.map((item, idx) => (
                  <Badge key={idx} color="bg-pink-100 text-pink-800">
                    {item}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">No items in inventory</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Location */}
        {user.location && (
          <motion.div
            className="bg-gray-50 p-6 rounded-2xl shadow-md"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <MapPin className="text-red-500" /> Location
            </h2>
            <p>
              Lat: {user.location.coordinates[1]}, Lng:{" "}
              {user.location.coordinates[0]}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* RENDER THE MODAL */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        username={user?.username || ""}
      />
    </div>
  );
}