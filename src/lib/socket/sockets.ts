export const openSocket = () => {
  const socket = new WebSocket("ws://localhost:8080");
  console.log("socket connected");
  return socket;
};

export const closeSocket = (socket: WebSocket) => {
  socket.close();
};
