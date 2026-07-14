/**
 * createApiThunk.js
 *
 * Every thunk in every slice currently repeats this shape:
 *
 *   export const fetchX = createAsyncThunk("x/fetchX", async (arg, thunkAPI) => {
 *     try {
 *       const response = await axios.get(`${API}/api/...`, { withCredentials: true });
 *       return response.data.someField;
 *     } catch (error) {
 *       return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to ...");
 *     }
 *   });
 *
 * That try/catch + rejectWithValue fallback is duplicated 40+ times across
 * app/store/*.js. createApiThunk factors it out while leaving every
 * call site's *external* contract identical: same action type string,
 * same fulfilled payload (whatever `select` returns), same rejected
 * payload shape (a string message), same thunkAPI available inside select
 * if needed.
 *
 * Usage (before -> after), functionally identical:
 *
 *   // before
 *   export const fetchStudentApplications = createAsyncThunk(
 *     "applications/fetchStudentApplications",
 *     async (userId, thunkAPI) => {
 *       try {
 *         const response = await apiClient.get(`/api/admin/applications/${userId}`);
 *         return response.data.applications;
 *       } catch (error) {
 *         return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch applications");
 *       }
 *     },
 *   );
 *
 *   // after
 *   export const fetchStudentApplications = createApiThunk(
 *     "applications/fetchStudentApplications",
 *     (userId) => apiClient.get(`/api/admin/applications/${userId}`),
 *     { select: (data) => data.applications, fallbackError: "Failed to fetch applications" },
 *   );
 */
import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * @param {string} type - action type string, same as createAsyncThunk's first arg
 * @param {(arg: any, thunkAPI: any) => Promise<import('axios').AxiosResponse>} request
 *        function that performs the axios call and returns the response
 * @param {object} [options]
 * @param {(data: any, arg: any) => any} [options.select] - maps response.data to the payload (defaults to response.data)
 * @param {string} [options.fallbackError] - message used when the server didn't send one
 */
export function createApiThunk(type, request, options = {}) {
  const { select = (data) => data, fallbackError = "Request failed" } = options;

  return createAsyncThunk(type, async (arg, thunkAPI) => {
    try {
      const response = await request(arg, thunkAPI);
      return select(response.data, arg);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || fallbackError,
      );
    }
  });
}
