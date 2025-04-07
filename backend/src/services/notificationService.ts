import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'message' | 'mention';
  content: string;
  data: any;
  isRead: boolean;
  createdAt: Date;
}

export class NotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const newNotification = await prisma.notification.create({
      data: {
        userId: notification.userId,
        type: notification.type,
        content: notification.content,
        data: notification.data,
        isRead: false,
      },
    });

    // Emit notification to the specific user
    this.io.to(notification.userId).emit('notification', newNotification);

    return newNotification;
  }

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Specific notification types
  async notifyNewComment(userId: string, postId: string, comment: any) {
    return this.createNotification({
      userId,
      type: 'comment',
      content: 'New comment on your post',
      data: { postId, comment },
      isRead: false,
    });
  }

  async notifyNewLike(userId: string, postId: string, liker: string) {
    return this.createNotification({
      userId,
      type: 'like',
      content: `${liker} liked your post`,
      data: { postId, liker },
      isRead: false,
    });
  }

  async notifyNewMessage(userId: string, sender: string, message: string) {
    return this.createNotification({
      userId,
      type: 'message',
      content: `New message from ${sender}`,
      data: { sender, message },
      isRead: false,
    });
  }

  async notifyMention(userId: string, postId: string, mentioner: string) {
    return this.createNotification({
      userId,
      type: 'mention',
      content: `${mentioner} mentioned you in a post`,
      data: { postId, mentioner },
      isRead: false,
    });
  }
} 