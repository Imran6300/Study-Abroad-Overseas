import { io } from "socket.io-client";

let socket = null;

/**
 * Returns the active socket, creating it if necessary.
 * Call this only when the user is authenticated.
 */
export const getSocket = () => {
  if (!socket || !socket.connected) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      withCredentials: true,
      // Reconnection settings — prevents infinite reconnect on hard logout
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
};

/**
 * Disconnects and destroys the current socket.
 * MUST be called on logout to prevent cross-user notification leakage.
 *
 * Usage in logout action:
 *   dispatch(logout());
 *   disconnectSocket();
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

/**
 * Returns true if the socket is currently connected.
 */
export const isSocketConnected = () => {
  return socket?.connected === true;
};
