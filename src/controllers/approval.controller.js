import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPendingContent = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const pendingContent = await prisma.content.findMany({
    where: {
      status: 'PENDING',
    },

    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      schedules: true,
    },

    skip,

    take: limit,

    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    count: pendingContent.length,
    content: pendingContent,
  });
});

export const approveContent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // find content
  const content = await prisma.content.findUnique({
    where: {
      id,
    },
  });

  if (!content) {
    return res.status(404).json({
      message: 'Content not found',
    });
  }

  // already approved
  if (content.status === 'APPROVED') {
    return res.status(400).json({
      message: 'Content already approved',
    });
  }

  // approve
  const updatedContent = await prisma.content.update({
    where: {
      id,
    },

    data: {
      status: 'APPROVED',

      approvedById: req.user.id,

      approvedAt: new Date(),

      rejectionReason: null,
    },
  });

  res.status(200).json({
    message: 'Content approved successfully',

    content: updatedContent,
  });
});

export const rejectContent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { reason } = req.body;

  // rejection reason required
  if (!reason) {
    return res.status(400).json({
      message: 'Rejection reason is required',
    });
  }

  // find content
  const content = await prisma.content.findUnique({
    where: {
      id,
    },
  });

  if (!content) {
    return res.status(404).json({
      message: 'Content not found',
    });
  }

  // reject
  const updatedContent = await prisma.content.update({
    where: {
      id,
    },

    data: {
      status: 'REJECTED',

      rejectionReason: reason,
    },
  });

  res.status(200).json({
    message: 'Content rejected successfully',

    content: updatedContent,
  });
});