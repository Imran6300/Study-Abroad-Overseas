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
| GET MY VISA
|--------------------------------------------------------------------------
*/

export const fetchMyVisa = () => async (dispatch) => {
  try {
    dispatch(visaStart());

    const response = await axios.get(`${API}/user/my/visa`, {
      withCredentials: true,
    });

    dispatch(visaSuccess(response.data.visa));
  } catch (error) {
    console.log(error.response.data);

    dispatch(
      visaFailure(error.response?.data?.message || "Failed to fetch visa"),
    );
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE VISA STEP
|--------------------------------------------------------------------------
*/

export const updateVisaStepAction =
  ({ visaId, stepId, data }) =>
  async (dispatch) => {
    try {
      const response = await axios.patch(
        `${API}/user/${visaId}/step/${stepId}`,
        data,
        {
          withCredentials: true,
        },
      );

      dispatch(updateVisaInStore(response.data.visa));
    } catch (error) {
      console.log(error);

      dispatch(
        visaFailure(
          error.response?.data?.message || "Failed to update visa step",
        ),
      );
    }
  };

/*
|--------------------------------------------------------------------------
| GET VISA LOGS
|--------------------------------------------------------------------------
*/

export const fetchVisaLogs = (visaId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API}/user/${visaId}/logs`, {
      withCredentials: true,
    });

    dispatch(logsSuccess(response.data.logs));
  } catch (error) {
    console.log(error);

    dispatch(
      visaFailure(error.response?.data?.message || "Failed to fetch visa logs"),
    );
  }
};
