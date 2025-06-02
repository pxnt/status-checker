export default function bootSockets(io) {
  console.log('Initializing Socket.IO handlers...');

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join public room for public component updates
    socket.join('public-updates');

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
} 