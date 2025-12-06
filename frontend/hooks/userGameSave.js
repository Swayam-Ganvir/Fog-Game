import { useCallback } from "react";
import axios from "axios";

export function useGameSave() {
  // ✅ Create axios instance here
  const apiClient = axios.create({
    baseURL: "http://localhost:8000/api/mapData",
    withCredentials: true,
  });

  // ✅ Attach token automatically
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Save game progress
  const saveGame = useCallback(async (progress) => {
    try {
      const res = await apiClient.post("/save-map-data",  progress );
      console.log("Game saved:", res.data);
    } catch (err) {
      console.error("Error saving game:", err.response?.data || err.message);
    }
  }, []);

  // ✅ Load game progress
  const loadGame = useCallback(async () => {
    try {
      const res = await apiClient.get("/get-map-data", {
        params: {userId: localStorage.getItem("userId")}
      });
      return res.data;
    } catch (err) {
      console.error("Error loading game:", err.response?.data || err.message);
      return null;
    }
  }, []);

  return { saveGame, loadGame };
}
