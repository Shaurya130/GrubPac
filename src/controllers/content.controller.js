import prisma from '../config/db.js';
import getRotatedContent from '../services/rotation.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadContent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    subject,
    startTime,
    endTime,
    duration,
  } = req.body;

  // validation
  if (!title || !subject) {
    return res.status(400).json({
      message: 'Title and subject are required',
    });
  }

  // file validation
  if (!req.file) {
    return res.status(400).json({
      message: 'File is required',
    });
  }

  // scheduling validation
  if (!startTime || !endTime) {
    return res.status(400).json({
      message: 'startTime and endTime are required',
    });
  }

  // find or create subject slot
  let slot = await prisma.contentSlot.findUnique({
    where: {
      subject,
    },
  });

  if (!slot) {
    slot = await prisma.contentSlot.create({
      data: {
        subject,
      },
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    return res.status(400).json({
      message: 'endTime must be greater than startTime',
    });
  }

  // create content
  const content = await prisma.content.create({
    data: {
      title,
      description,
      subject,

      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,

      uploadedById: req.user.id,

      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });

  // get latest rotation order
  const latestSchedule = await prisma.contentSchedule.findFirst({
    where: {
      slotId: slot.id,
    },

    orderBy: {
      rotationOrder: 'desc',
    },
  });

  // next order
  const nextRotationOrder = latestSchedule
    ? latestSchedule.rotationOrder + 1
    : 1;

  // create schedule
  const schedule = await prisma.contentSchedule.create({
    data: {
      contentId: content.id,

      slotId: slot.id,

      rotationOrder: nextRotationOrder,

      duration: Number(duration) || 5,
    },
  });

  res.status(201).json({
    message: 'Content uploaded successfully',

    content,

    schedule,
  });
});

export const getMyContent = asyncHandler(async (
  req,
  res
) => {
  const subject = req.query.subject;

  const status = req.query.status
    ? req.query.status.toUpperCase()
    : undefined;

  const content = await prisma.content.findMany({
    where: {
      uploadedById: req.user.id,

      ...(subject && { subject }),

      ...(status && { status }),
    },

    include: {
      schedules: true,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    count: content.length,

    content,
  });
});

export const getLiveContent = asyncHandler(async (
  req,
  res
) => {
  const { teacherId } = req.params;

  const now = new Date();

  // fetch approved + scheduled content
  const content = await prisma.content.findMany({
    where: {
      uploadedById: teacherId,

      status: 'APPROVED',

      startTime: {
        lte: now,
      },

      endTime: {
        gte: now,
      },
    },

    include: {
      schedules: true,
    },
  });

  // no content
  if (!content.length) {
    return res.status(200).json({
      message: 'No content available',
      content: null,
    });
  }

  // group by subject
  const subjectMap = {};

  for (const item of content) {
    if (!subjectMap[item.subject]) {
      subjectMap[item.subject] = [];
    }

    subjectMap[item.subject].push(item);
  }

  // rotate subject-wise
  const liveContent = {};

  for (const subject in subjectMap) {
    const rotatedContent = getRotatedContent(subjectMap[subject]);

    liveContent[subject] = {
      id: rotatedContent.id,

      title: rotatedContent.title,

      description: rotatedContent.description,

      subject: rotatedContent.subject,

      fileUrl: rotatedContent.filePath,

      startTime: rotatedContent.startTime,

      endTime: rotatedContent.endTime,
    };
  }

  res.status(200).json({
    message: 'Live content fetched',

    liveContent,
  });
});