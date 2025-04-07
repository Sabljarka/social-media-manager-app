import { PrismaClient } from '@prisma/client';
import { FacebookPage, InstagramAccount, Post, Comment } from '@prisma/client';

const prisma = new PrismaClient();

export const socialService = {
  // Facebook methods
  async saveFacebookPage(page: Omit<FacebookPage, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.facebookPage.create({
      data: page,
    });
  },

  async getFacebookPages(userId: string) {
    return prisma.facebookPage.findMany({
      where: { userId },
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
      },
    });
  },

  async updateFacebookPage(id: string, data: Partial<FacebookPage>) {
    return prisma.facebookPage.update({
      where: { id },
      data,
    });
  },

  async deleteFacebookPage(id: string) {
    return prisma.facebookPage.delete({
      where: { id },
    });
  },

  // Instagram methods
  async saveInstagramAccount(account: Omit<InstagramAccount, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.instagramAccount.create({
      data: account,
    });
  },

  async getInstagramAccounts(userId: string) {
    return prisma.instagramAccount.findMany({
      where: { userId },
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
      },
    });
  },

  async updateInstagramAccount(id: string, data: Partial<InstagramAccount>) {
    return prisma.instagramAccount.update({
      where: { id },
      data,
    });
  },

  async deleteInstagramAccount(id: string) {
    return prisma.instagramAccount.delete({
      where: { id },
    });
  },

  // Post methods
  async savePost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.post.create({
      data: post,
    });
  },

  async getPosts(pageId: string) {
    return prisma.post.findMany({
      where: { pageId },
      include: {
        comments: true,
      },
    });
  },

  async updatePost(id: string, data: Partial<Post>) {
    return prisma.post.update({
      where: { id },
      data,
    });
  },

  async deletePost(id: string) {
    return prisma.post.delete({
      where: { id },
    });
  },

  // Comment methods
  async saveComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.comment.create({
      data: comment,
    });
  },

  async getComments(postId: string) {
    return prisma.comment.findMany({
      where: { postId },
    });
  },

  async updateComment(id: string, data: Partial<Comment>) {
    return prisma.comment.update({
      where: { id },
      data,
    });
  },

  async deleteComment(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  },

  // Token refresh methods
  async saveTokenRefresh(userId: string, platform: 'facebook' | 'instagram', token: string, expiresAt: Date) {
    return prisma.tokenRefresh.create({
      data: {
        userId,
        platform,
        token,
        expiresAt,
      },
    });
  },

  async getTokenRefresh(userId: string, platform: 'facebook' | 'instagram') {
    return prisma.tokenRefresh.findFirst({
      where: {
        userId,
        platform,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  },
}; 