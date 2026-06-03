import axios from "axios";
import {
  visaStart,
  visaSuccess,
  visaFailure,
  updateVisaInStore,
  logsSuccess,
} from "../visaSlice";

// ─── Route base — must match the Express mount point in app.js ────────────────
// Backend: app.use("/user/visa", visaprogressRouter)
// If the mount point changes, update VISA_BASE here.
const VISA_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/visa`;

/*
|--------------------------------------------------------------------------
| GET MY VISA  →  GET /user/visa/my/visa
|--------------------------------------------------------------------------
*/
export const fetchMyVisa = () => async (dispatch) => {
  try {
    dispatch(visaStart());
    const response = await axios.get(`${VISA_BASE}/my/visa`, {
      withCredentials: true,
    });
    dispatch(visaSuccess(response.data.visa ?? null));
  } catch (error) {
    dispatch(
      visaFailure(error.response?.data?.message || "Failed to fetch visa"),
    );
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE VISA STEP  →  PATCH /user/visa/:visaId/step/:stepId
|--------------------------------------------------------------------------
*/
export const updateVisaStepAction =
  ({ visaId, stepId, data }) =>
  async (dispatch) => {
    try {
      const response = await axios.patch(
        `${VISA_BASE}/${visaId}/step/${stepId}`,
        data,
        { withCredentials: true },
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
    const response = await axios.get(`${VISA_BASE}/${visaId}/logs`, {
      withCredentials: true,
    });
    dispatch(logsSuccess(response.data.logs ?? []));
  } catch (error) {
    dispatch(
      visaFailure(error.response?.data?.message || "Failed to fetch visa logs"),
    );
  }
};
