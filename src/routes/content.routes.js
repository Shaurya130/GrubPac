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

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content APIs
 */

/**
 * @swagger
 * /api/content/upload:
 *   post:
 *     summary: Upload content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Content uploaded successfully
 */

/**
 * @swagger
 * /api/content/live/{teacherId}:
 *   get:
 *     summary: Get live content
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live content fetched
 */

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