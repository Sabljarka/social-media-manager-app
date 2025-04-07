import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { addNotification, Notification as StoreNotification } from '../store/slices/notificationSlice';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

interface CommentData {
  postId: string;
  comment: {
    id: string;
    message: string;
    author: {
      id: string;
      name: string;
      picture: string;
    };
  };
}

class SocketService {
  private socket: Socket | null = null;

  connect(url: string) {
    this.socket = io(url);
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNotification(callback: (notification: StoreNotification) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  onNewComment(callback: (data: CommentData) => void) {
    if (this.socket) {
      this.socket.on('new_comment', callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
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

  onError(callback: (error: Error) => void) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }
}

const socketService = new SocketService();
export default socketService; 