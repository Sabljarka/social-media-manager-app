import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { addNotification } from '../store/slices/notificationSlice';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId: string) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('http://localhost:3001', {
      query: { userId },
    });

    this.setupListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupListeners() {
    if (!this.socket) return;

    // Listen for new notifications
    this.socket.on('notification', (notification) => {
      store.dispatch(addNotification(notification));
    });

    // Listen for new comments
    this.socket.on('newComment', (data) => {
      const { postId, comment } = data;
      // Handle new comment (update UI, show notification, etc.)
      console.log('New comment:', comment);
    });

    // Listen for connection status
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Method to join a specific room (e.g., for post updates)
  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join', roomId);
    }
  }

  // Method to leave a room
  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave', roomId);
    }
  }
}

export const socketService = SocketService.getInstance(); 