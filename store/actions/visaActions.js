import axios from "axios";

import {
  visaStart,
  visaSuccess,
  visaFailure,
  updateVisaInStore,
  logsSuccess,
} from "../visaSlice";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

/*
|--------------------------------------------------------------------------
| GET MY VISA  →  GET /user/visa/my/visa
|--------------------------------------------------------------------------
*/

export const fetchMyVisa = () => async (dispatch) => {
  try {
    dispatch(visaStart());

    const response = await axios.get(`${API}/user/visa/my/visa`, {
      withCredentials: true,
    });

    dispatch(visaSuccess(response.data.visa));
  } catch (error) {
    // FIX: guard against undefined error.response (network failures)
    dispatch(
      visaFailure(error.response?.data?.message || "Failed to fetch visa"),
    );
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE VISA STEP  →  PATCH /user/visa/:visaId/step/:stepId
|
| BUG FIXED: was calling `${API}/visa/${visaId}/step/${stepId}`
|            which hits a non-existent route (missing /user prefix).
|            The backend mounts visaprogressRouter at /user/visa,
|            so the correct path is /user/visa/:visaId/step/:stepId.
|--------------------------------------------------------------------------
*/

export const updateVisaStepAction =
  ({ visaId, stepId, data }) =>
  async (dispatch) => {
    try {
      const response = await axios.patch(
        `${API}/user/visa/${visaId}/step/${stepId}`, // ← FIXED: was /visa/...
        data,
        {
          withCredentials: true,
        },
      );

      dispatch(updateVisaInStore(response.data.visa));
    } catch (error) {
      dispatch(
        visaFailure(
          error.response?.data?.message || "Failed to update visa step",
        ),
      );
    }
  };

/*
|--------------------------------------------------------------------------
| GET VISA LOGS  →  GET /user/visa/:visaId/logs
|--------------------------------------------------------------------------
*/

export const fetchVisaLogs = (visaId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/user/visa/${visaId}/logs`, {
      withCredentials: true,
    });

    dispatch(logsSuccess(response.data.logs));
  } catch (error) {
    dispatch(
      visaFailure(error.response?.data?.message || "Failed to fetch visa logs"),
    );
  }
};
