"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  User,
  Trophy,
  Package,
  Clock,
  MapPin,
  Users,
  Star,
  Shield,
  Sword,
  Eye,
  Medal,
  Settings,
  Edit3,
  Calendar,
  Target,
  Zap,
  Crown,
  Compass,
  LucideDelete,
  CheckCircle,
} from "lucide-react";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    level: 0,
    experience: 0,
    timePlayed: 0,
    distance: 0,
    friends: 0,
    achievements: 0,
    territories: 0,
    battleScore: 0,
  });
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // fetch user data from backend
  useEffect(() => {
    if (!id) return;

    axios
      .get(`https://fog-game.onrender.com/api/user/userProfile/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // animate stats once user is loaded
  useEffect(() => {
    if (!user) return;
    setIsLoaded(true);

    const animateNumber = (target, key, duration = 2000) => {
      const start = 0;
      const startTime = Date.now();

      const updateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(start + (target - start) * progress);

        setAnimatedStats((prev) => ({
          ...prev,
          [key]: currentValue,
        }));

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      };

      requestAnimationFrame(updateNumber);
    };

    // Use backend fields
    animateNumber(user.stats?.timePlayed || 0, "timePlayed", 1800);
    animateNumber(user.stats?.distanceTravelled || 0, "distance", 1600);
    animateNumber(
      user.stats?.totalCheckpoints || user.checkpoints?.length || 0,
      "territories",
      1400
    );
    animateNumber(user.friends?.length || 0, "friends", 1200);
    animateNumber(user.inventory?.length || 0, "achievements", 1200);

    // keep optional ones (future expansion)
    animateNumber(user.level || 1, "level", 1500);
    animateNumber(user.experience || 0, "experience", 2000);
    animateNumber(user.battleScore || 0, "battleScore", 2200);
  }, [user]);


  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (!user) return <p className="text-center p-10">User not found</p>;

  // helper for rarity styling
  const getRarityColor = (rarity) => {
    const colors = {
      common: "text-gray-600 bg-gray-100 border-gray-200",
      rare: "text-blue-600 bg-blue-50 border-blue-200",
      epic: "text-purple-600 bg-purple-50 border-purple-200",
      legendary: "text-orange-600 bg-orange-50 border-orange-200",
      mythic: "text-pink-600 bg-pink-50 border-pink-200",
    };
    return colors[rarity] || colors.common;
  };

  const xpPercentage = user.nextLevelXp
    ? (animatedStats.experience / user.nextLevelXp) * 100
    : 0;

  // Format time from ms → h m
  const formatTimePlayed = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      // Use DELETE method for deleting resources. Ensure your backend supports this.
      await axios.post(`https://fog-game.onrender.com/api/user/deleteProfile/${id}`);
      alert("Profile deleted successfully");
      router.push("/"); // Correctly use the router instance
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div
        className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 ${
                  isLoaded ? "scale-100 rotate-0" : "scale-0 rotate-180"
                }`}
              >
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div
                className={`absolute -bottom-2 -right-2 bg-yellow-500 rounded-full px-3 py-1 text-white font-bold text-sm shadow-lg transform transition-all duration-700 delay-300 ${
                  isLoaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                {animatedStats.level}
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl scale-110 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>

            <div
              className={`flex-1 text-center sm:text-left transition-all duration-700 delay-200 ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                  {user.username}
                </h1>
                <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-gray-600 mb-4">
                {user.guildRank || "Adventurer"} • Member since{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>

              {/* XP Bar */}
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Level {animatedStats.level}</span>
                  <span>
                    {animatedStats.experience.toLocaleString()} /{" "}
                    {user.nextLevelXp?.toLocaleString() || "∞"} XP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 delay-1000 shadow-sm"
                    style={{ width: isLoaded ? `${xpPercentage}%` : "0%" }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)} // open modal
              className={`flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <LucideDelete className="w-4 h-4" />
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            {
              icon: Clock,
              value: formatTimePlayed(animatedStats.timePlayed),
              label: "Time Played",
              color: "text-blue-500",
              delay: "delay-500",
            },
            {
              icon: Compass,
              value: `${animatedStats.distance.toFixed(1)} m`,
              label: "Distance",
              color: "text-green-500",
              delay: "delay-600",
            },
            {
              icon: Users,
              value: animatedStats.friends,
              label: "Friends",
              color: "text-purple-500",
              delay: "delay-700",
            },
            {
              icon: Trophy,
              value: animatedStats.achievements,
              label: "Inventory Items",
              color: "text-yellow-500",
              delay: "delay-800",
            },
            {
              icon: Target,
              value: animatedStats.territories,
              label: "Checkpoints",
              color: "text-red-500",
              delay: "delay-900",
            },
            {
              icon: Zap,
              value: animatedStats.battleScore.toLocaleString(),
              label: "Battle Score",
              color: "text-orange-500",
              delay: "delay-1000",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 ${
                stat.delay
              } ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <stat.icon
                className={`w-6 h-6 ${stat.color} mb-2 animate-pulse`}
              />
              <div className="text-2xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className={`flex flex-wrap gap-2 mb-8 bg-white/70 backdrop-blur-sm rounded-xl p-2 border border-gray-200 shadow-sm transition-all duration-700 delay-1200 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "achievements", label: "Achievements", icon: Trophy },
            { id: "inventory", label: "Inventory", icon: Package },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className={`transition-all duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  Recent Activity
                </h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>

              {/* Current Equipment */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Sword className="w-6 h-6 text-purple-500" />
                  Current Equipment
                </h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
                Achievements ({user.achievements?.length || 0})
              </h2>
              <p className="text-gray-600">
                Achievements data coming from DB soon
              </p>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-purple-500 animate-pulse" />
                Inventory ({user.inventory?.length || 0} items)
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.inventory?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                        {item.name}
                      </h3>
                      {item.quantity > 1 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        {item.type}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getRarityColor(
                          item.rarity
                        )} transform transition-all duration-300 hover:scale-110`}
                      >
                        {item.rarity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete this profile? This action is
              irreversible and all data will be permanently lost.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={isDeleting}
                className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-red-400"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}