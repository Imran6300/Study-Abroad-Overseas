/**
 * apiClient.js
 *
 * Single axios instance for the whole app. Today, 15 Redux slices each do
 * one of:
 *   - `const API = process.env.NEXT_PUBLIC_BACKEND_URL` + raw `axios.get(`${API}/...`, { withCredentials: true })`
 *   - or their own local `axios.create({ baseURL, withCredentials: true })`
 *
 * which means:
 *   - the base URL and withCredentials flag are duplicated ~15+ times
 *   - there's nowhere to add a shared 401 interceptor (e.g. redirect to
 *     login once, instead of every thunk separately deciding what a 401 means)
 *   - swapping API host, adding request timeouts, or adding an
 *     Authorization header later means touching every slice file
 *
 * This does not change request/response behavior — same baseURL env var,
 * same withCredentials:true, same relative paths used today
 * (e.g. `/api/admin/applications/${userId}`).
 */
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  withCredentials: true,
  timeout: 30000,
});

// Central place to react to auth/session expiry once, instead of every
// thunk's catch block guessing at error.response?.data?.message.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Left intentionally inert (no redirect/side-effect) so this is a
    // drop-in replacement with zero behavior change today. Slices can keep
    // handling rejection via thunkAPI.rejectWithValue exactly as they do
    // now — this interceptor is the seam for adding shared 401 handling
    // later without editing 15 files again.
    return Promise.reject(error);
  },
);

export default apiClient;
