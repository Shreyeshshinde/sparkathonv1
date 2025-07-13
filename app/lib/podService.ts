import prisma from '../../lib/prisma';

export interface CreatePodData {
  name: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
}

export interface JoinPodData {
  inviteCode: string;
  userId: string;
  userName: string;
  userAvatar?: string;
}

export interface AddItemData {
  podId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  addedById: string;
}

export class PodService {
  // Create a new pod
  static async createPod(data: CreatePodData) {
    const inviteCode = this.generateInviteCode();
    
    const pod = await prisma.shoppingPod.create({
      data: {
        name: data.name,
        inviteCode,
        ownerId: data.ownerId,
        members: {
          create: {
            userId: data.ownerId,
            isOwner: true,
          }
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        items: true
      }
    });

    return pod;
  }

  // Join a pod using invite code
  static async joinPod(data: JoinPodData) {
    const pod = await prisma.shoppingPod.findUnique({
      where: { inviteCode: data.inviteCode },
      include: {
        members: {
          include: {
            user: true
          }
        },
        items: true
      }
    });

    if (!pod) {
      throw new Error('Invalid invite code');
    }

    // Check if user is already a member (using database user ID)
    const existingMember = pod.members.find((m: any) => m.userId === data.userId);
    if (existingMember) {
      throw new Error('Already a member of this pod');
    }

    // Add user to pod
    await prisma.podMember.create({
      data: {
        podId: pod.id,
        userId: data.userId, // This should be the database user ID
        isOwner: false,
      }
    });

    // Return updated pod with new member
    const updatedPod = await prisma.shoppingPod.findUnique({
      where: { id: pod.id },
      include: {
        members: {
          include: {
            user: true
          }
        },
        items: true
      }
    });

    return updatedPod;
  }

  // Get pod by ID
  static async getPodById(podId: string) {
    return await prisma.shoppingPod.findUnique({
      where: { id: podId },
      include: {
        members: {
          include: {
            user: true
          }
        },
        items: true
      }
    });
  }

  // Get pod by invite code
  static async getPodByInviteCode(inviteCode: string) {
    return await prisma.shoppingPod.findUnique({
      where: { inviteCode },
      include: {
        members: {
          include: {
            user: true
          }
        },
        items: true
      }
    });
  }

  // Get user's pods
  static async getUserPods(userId: string) {
    return await prisma.shoppingPod.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        items: true
      }
    });
  }

  // Add item to pod
  static async addItemToPod(data: AddItemData) {
    // Find the user by Clerk ID to get the database ID
    const user = await prisma.user.findUnique({
      where: { clerkId: data.addedById },
      select: { id: true, name: true, avatar: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const existingItem = await prisma.podItem.findUnique({
      where: {
        podId_productId: {
          podId: data.podId,
          productId: data.productId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.podItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity }
      });

      return {
        ...updatedItem,
        addedBy: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }
      };
    } else {
      // Create new item
      const newItem = await prisma.podItem.create({
        data: {
          podId: data.podId,
          productId: data.productId,
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          addedById: user.id, // Use database user ID
        }
      });

      return {
        ...newItem,
        addedBy: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }
      };
    }
  }

  // Update item quantity
  static async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return await prisma.podItem.delete({
        where: { id: itemId }
      });
    }

    return await prisma.podItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }

  // Remove item from pod
  static async removeItemFromPod(itemId: string) {
    return await prisma.podItem.delete({
      where: { id: itemId }
    });
  }

  // Generate unique invite code
  private static generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
} 