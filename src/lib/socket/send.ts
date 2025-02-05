const socketSend = (socket: WebSocket | null, data: ArrayBuffer) => {
  console.log("SOCKET SEND", socket, data);
  if (!socket || !data) return;

  try {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(data);

      console.log("data sent to socket");
    }
  } catch (error) {
    console.log("Error sending data: ", error);
  }
};
export default socketSend;
