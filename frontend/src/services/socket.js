import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const subscribeToEvent = (eventName, callback) => {
  socket.on(eventName, callback);
};

export const unsubscribeFromEvent = (eventName, callback) => {
  socket.off(eventName, callback);
}; 