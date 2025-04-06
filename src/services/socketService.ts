import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { addNotification } from '../store/slices/notificationSlice';

interface Notification {
  type: string;
  message: string;
  timestamp: string;
}

interface CommentData {
  postId: string;
  comment: {
    id: string;
    content: string;
    author: string;
  };
}

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

  connect(url: string): void {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(url);

    this.setupListeners();
  }

  disconnect(): void {
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
    this.socket.on('new_comment', (data) => {
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

  public onNotification(callback: (notification: Notification) => void): void {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  public onNewComment(callback: (data: CommentData) => void): void {
    if (this.socket) {
      this.socket.on('new_comment', callback);
    }
  }

  public onError(callback: (error: Error) => void): void {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }
}

export default SocketService; 