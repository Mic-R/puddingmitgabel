import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { moderateText } from '@/lib/contentModerator';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { content, eventId } = await request.json();

    if (!content || !eventId) {
      return NextResponse.json(
        { error: 'Content and eventId are required' },
        { status: 400 }
      );
    }

    // Moderate the content using Azure
    const moderationResult = await moderateText(content);

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: (session.user as any).id,
        eventId,
        moderationStatus: moderationResult.approved ? 'APPROVED' : 'REJECTED',
        moderationResult: moderationResult.reason || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
