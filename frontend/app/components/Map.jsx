"use client";

import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polyline } from "react-leaflet";
import { LogOut, MapPin, Navigation, X, Check, Compass, Save, Edit3, AlertTriangle } from "lucide-react"; // Added AlertTriangle for modal
import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGameSave } from "@/hooks/userGameSave";

import PlayerLocationMarker from "./PlayerLocationMarker";
import MistOverlay from "./MistOverlay";
import axios from "axios";

// ✅ Styled checkpoint icon
const checkpointIcon = new L.Icon({
  iconUrl: "/checkpoint.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  className: "checkpoint-marker",
});

// 📌 Map click handler
function MapClickHandler({ trail, setCheckpoints, ignoreNextClickRef, setAlertMessage, setShowAlert, handleSaveGame }) {
  useMapEvents({
    click(e) {
      if (ignoreNextClickRef.current) {
        ignoreNextClickRef.current = false;
        return;
      }
      const { lat, lng } = e.latlng;

      const isOnTrail = trail.some(([tLat, tLng]) => {
        const distance = L.latLng(tLat, tLng).distanceTo(L.latLng(lat, lng));
        return distance < 300;
      });

      if (isOnTrail) {
        setCheckpoints((prev) => {
          const newCheckpoints = [
            ...prev,
            {
              lat,
              lng,
              name: `Checkpoint ${prev.length + 1}`,
              reachedAt: new Date().toISOString(),
            },
          ];
          return newCheckpoints;
        });

        setAlertMessage("Checkpoint placed successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        setAlertMessage("You can only place checkpoints within 300 meters of the trail!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    },
  });
  return null;
}

// 📌 Center button
function CenterButton({ playerPos, ignoreNextClickRef, setAlertMessage, setShowAlert }) {
  const map = useMap();
  return (
    <div className="absolute top-6 right-6 z-[1000]">
      <button
        className="group bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-blue-400 
                   rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 
                   flex items-center gap-2 text-gray-700 hover:text-blue-600"
        onClick={() => {
          ignoreNextClickRef.current = true;
          if (playerPos) {
            map.setView(playerPos, 15);
            setAlertMessage("Centered on your location!");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          }
        }}
      >
        <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-medium hidden sm:inline">Center on Me</span>
      </button>
    </div>
  );
}

// 📌 Stats panel
function StatsPanel({ trail, checkpoints }) {
  const distance = trail.length > 1 ? (trail.length * 50).toFixed(1) : "0";
  return (
    <div className="absolute bottom-6 left-6 z-[1000]">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 min-w-[200px]">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600" />
          Adventure Stats
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Distance Traveled:</span>
            <span className="font-medium text-blue-600">{distance}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Checkpoints:</span>
            <span className="font-medium text-green-600">{checkpoints.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 📌 Alert
function Alert({ show, message, onClose }) {
  if (!show) return null;
  const isSuccess = message.includes("successfully") || message.includes("loaded") || message.includes("updated") || message.includes("Centered");
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[1001]">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 ${isSuccess
            ? "bg-green-50/90 border-green-200 text-green-800"
            : "bg-red-50/90 border-red-200 text-red-800"
          }`}
      >
        {isSuccess ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className={`ml-2 hover:opacity-70 transition-opacity ${isSuccess ? "text-green-600" : "text-red-600"
            }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ✨ Checkpoint Modal Component
function CheckpointModal({ isOpen, onClose, checkpoint, onVisit, onRemove, onSaveName }) {
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (checkpoint) {
      setEditedName(checkpoint.name || `Checkpoint ${checkpoint.index + 1}`);
    }
  }, [checkpoint]);

  if (!isOpen || !checkpoint) return null;

  const { index, lat, lng, reachedAt } = checkpoint;
  const formattedDate = new Date(reachedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const handleSave = () => {
    onSaveName(index, editedName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <h4 className="font-bold text-xl text-gray-800">Edit Checkpoint</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="checkpoint-name" className="block text-sm font-medium text-gray-600 mb-1">
              Checkpoint Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="checkpoint-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            <span className="font-medium">Created:</span> {formattedDate}
          </p>
          <p className="text-xs text-gray-500">
            <span className="font-medium">Coords:</span> {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleSave} className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
            Save Name
          </button>
          <button onClick={() => { onVisit(index); onClose(); }} className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
            Visit
          </button>
          <button onClick={() => { onRemove(index); onClose(); }} className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ✨ NEW: Confirmation Modal for Logout
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <h4 className="font-bold text-xl text-gray-800">{title}</h4>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            Confirm Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeafletMap() {
  const [playerPos, setPlayerPos] = useState(null);
  const [trail, setTrail] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pathToCheckpoint, setPathToCheckpoint] = useState(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✨ State for the new modal

  const ignoreNextClickRef = useRef(false);
  const router = useRouter();

  const { saveGame, loadGame } = useGameSave();

  const userId = typeof window !== "undefined" ? localStorage.getItem("mongo_user_id") : null;

  useEffect(() => {
    (async () => {
      const saved = await loadGame();
      if (saved) {
        setTrail(saved.pathHistory || []);
        setCheckpoints(
          (saved.checkpoints || []).map((cp, index) => {
            if (Array.isArray(cp)) {
              return { lat: cp[0], lng: cp[1], name: `Checkpoint ${index + 1}`, reachedAt: new Date().toISOString() };
            }
            if (cp && cp.lat !== undefined && cp.lng !== undefined) {
              return {
                ...cp,
                name: cp.name || `Checkpoint ${index + 1}`,
                reachedAt: cp.reachedAt || cp.createdAt || new Date().toISOString()
              };
            }
            return null;
          }).filter(Boolean)
        );
        if (saved.location) {
          setPlayerPos([saved.location.coordinates[1], saved.location.coordinates[0]]);
        }
      }
    })();
  }, [loadGame]);

  useEffect(() => {
    if (!playerPos) return;
    const interval = setInterval(() => {
      const userId = localStorage.getItem("mongo_user_id");
      if (!userId) {
        console.warn("User ID not found. Skipping the auto-save");
        return;
      }
      saveGame({
        userId,
        location: playerPos
          ? {
            type: "Point",
            coordinates: [playerPos[1], playerPos[0]],
            lastUpdate: new Date().toISOString(),
          }
          : null,
        pathHistory: trail,
        checkpoints: checkpoints,
        stats: {
          distanceTravelled: trail.length * 50,
          totalCheckpoints: checkpoints.length,
        },
        fogClearedArea: [],
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [playerPos, trail, checkpoints, saveGame, userId]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPlayerPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSaveGame = useCallback(async () => { // Wrapped in useCallback for stability
    try {
      setSaving(true);
      setMessage("");
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in to save the game.");
        setSaving(false);
        return;
      }
      await axios.post(
        "http://localhost:8000/api/mapData/save-map-data",
        {
          userId,
          location: playerPos
            ? {
              type: "Point",
              coordinates: [playerPos[1], playerPos[0]],
              lastUpdate: new Date().toISOString(),
            }
            : null,
          pathHistory: trail,
          checkpoints: checkpoints,
          stats: {
            distanceTravelled: trail.length * 50,
            totalCheckpoints: checkpoints.length
          },
          fogClearedArea: [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Game saved successfully");
    } catch (error) {
      setMessage("Error saving game. Please try again.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [userId, playerPos, trail, checkpoints]); // Dependencies for useCallback

  // ✨ MODIFIED: This function handles the final logout action after confirmation
  const handleConfirmLogout = async () => {
    setShowLogoutModal(false); // Close modal first
    await handleSaveGame(); // Automatically save the game

    try {
      const userId = localStorage.getItem("mongo_user_id");
      if (userId) {
        await axios.post("http://localhost:8000/api/userLogout", {
          userId,
          isOnline: false,
        });
      }
    } catch (err) {
      console.error("Error updating online status:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("mongo_user_id");
      router.push("/auth");
    }
  };

  const handleCheckpointAction = async (index) => {
    try {
      if (!playerPos) return;
      const userId = localStorage.getItem("mongo_user_id");
      const [lat, lng] = playerPos;
      const response = await axios.get("http://localhost:8000/api/user/path", {
        params: { userId, lat, lng, checkpointIndex: index },
      });
      const { path } = response.data;
      const leafletPath = path.map(([lng, lat]) => [lat, lng]);
      setPathToCheckpoint(leafletPath);
      setAlertMessage(`Path to Checkpoint ${index + 1} loaded!`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error fetching path:", error);
      setAlertMessage("Failed to fetch path!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleRemoveCheckpoint = async (index) => {
    try {
      const res = await axios.delete("http://localhost:8000/api/user/deleteCheckpoint", {
        data: { userId: userId, index },
      });

      const updatedCheckpoints = (res.data.checkpoints || [])
        .filter(Boolean)
        .map((cp, idx) => ({
          lat: cp.lat,
          lng: cp.lng,
          name: cp.name || `Checkpoint ${idx + 1}`,
          createdAt: cp.createdAt || new Date().toISOString(),
        }));
      setCheckpoints(updatedCheckpoints);
      setAlertMessage("Checkpoint removed successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error(err);
      setAlertMessage("Failed to remove checkpoint!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleSaveCheckpointName = (index, newName) => {
    const updatedCheckpoints = [...checkpoints];
    updatedCheckpoints[index].name = newName;
    setCheckpoints(updatedCheckpoints);
    setAlertMessage("Checkpoint name updated successfully!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    handleSaveGame();
  };

  if (!playerPos) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Adventure Map</h2>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <MapContainer center={playerPos} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <PlayerLocationMarker setTrail={setTrail} />
        <MistOverlay trail={trail} />
        <MapClickHandler
          trail={trail}
          setCheckpoints={setCheckpoints}
          ignoreNextClickRef={ignoreNextClickRef}
          setAlertMessage={setAlertMessage}
          setShowAlert={setShowAlert}
        />
        {checkpoints.filter(Boolean).map((pos, idx) => {
          const position = [pos.lat, pos.lng];
          return (
            <Marker
              key={idx}
              position={position}
              icon={checkpointIcon}
              eventHandlers={{
                click: () => {
                  setSelectedCheckpoint({ index: idx, ...pos });
                },
              }}
            />
          );
        })}
        {pathToCheckpoint && <Polyline positions={pathToCheckpoint} color="blue" weight={5} opacity={0.7} />}
        <CenterButton playerPos={playerPos} ignoreNextClickRef={ignoreNextClickRef} setAlertMessage={setAlertMessage} setShowAlert={setShowAlert} />
      </MapContainer>
      <div className="absolute top-24 right-6 z-[1000]">
        <button
          onClick={handleSaveGame}
          disabled={saving}
          className="group bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-blue-400 
                     rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 
                     flex items-center gap-2 text-gray-700 hover:text-blue-600 disabled:opacity-50"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium">{saving ? "Saving..." : "Save Game"}</span>
        </button>
        {message && (
          <p className="mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 
                         px-3 py-2 rounded-lg shadow text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
      <div className="absolute bottom-20 right-6 z-[1000]">
        <button
          onClick={() => {
            handleSaveGame();
            const userId = localStorage.getItem("mongo_user_id");
            if (userId) {
              router.push(`/user/userProfile/${userId}`);
            }
          }}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md 
                     text-blue-600 font-medium px-4 py-2 rounded-xl shadow-lg border border-blue-200 
                     hover:bg-blue-500 hover:text-white transition-all duration-300"
        >
          <MapPin size={18} />
          Profile
        </button>
      </div>
      <div className="absolute bottom-6 right-6 z-[1000]">
        {/* ✨ MODIFIED: Logout button now opens the confirmation modal */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md 
                     text-red-600 font-medium px-4 py-2 rounded-xl shadow-lg border border-red-200 
                     hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      <CheckpointModal
        isOpen={!!selectedCheckpoint}
        onClose={() => setSelectedCheckpoint(null)}
        checkpoint={selectedCheckpoint}
        onVisit={handleCheckpointAction}
        onRemove={handleRemoveCheckpoint}
        onSaveName={handleSaveCheckpointName}
      />
      {/* ✨ NEW: Render the logout confirmation modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Your current progress will be saved automatically. Are you sure you want to log out?"
      />
      <StatsPanel trail={trail} checkpoints={checkpoints} />
      <Alert show={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
    </div>
  );
}