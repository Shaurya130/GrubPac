import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';

import roleMiddleware from '../middlewares/role.middleware.js';

import upload from '../config/multer.js';

import validate from '../middlewares/validate.middleware.js';

import {
  uploadContent,
  getMyContent,
  getLiveContent
} from '../controllers/content.controller.js';

import {
  uploadContentSchema,
} from '../validations/content.validation.js';

const router = express.Router();

router.post(
  '/upload',

  authMiddleware,

  roleMiddleware('TEACHER'),

  upload.single('file'),

  validate(uploadContentSchema),

  uploadContent
);

router.get(
  '/my-content',

  authMiddleware,

  roleMiddleware('TEACHER'),

  getMyContent
);

router.get(
  '/live/:teacherId',
  getLiveContent
);

export default router;