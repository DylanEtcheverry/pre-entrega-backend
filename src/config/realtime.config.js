let socketServer;

export function setSocketServer(server) {
  socketServer = server;
}

export function emitRealtime(event, payload) {
  socketServer?.emit(event, payload);
}