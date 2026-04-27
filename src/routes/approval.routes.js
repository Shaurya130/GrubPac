import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';

import roleMiddleware from '../middlewares/role.middleware.js';

import {
  getPendingContent,
  approveContent,
  rejectContent,
} from '../controllers/approval.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Approval
 *   description: Principal approval APIs
 */

/**
 * @swagger
 * /api/approval/pending:
 *   get:
 *     summary: Get pending content
 *     tags: [Approval]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending content fetched
 */

/**
 * @swagger
 * /api/approval/{id}/approve:
 *   patch:
 *     summary: Approve content
 *     tags: [Approval]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content approved
 */

/**
 * @swagger
 * /api/approval/{id}/reject:
 *   patch:
 *     summary: Reject content
 *     tags: [Approval]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content rejected
 */

router.get(
  '/pending',

  authMiddleware,

  roleMiddleware('PRINCIPAL'),

  getPendingContent
);

router.patch(
  '/:id/approve',

  authMiddleware,

  roleMiddleware('PRINCIPAL'),

  approveContent
);

router.patch(
  '/:id/reject',

  authMiddleware,

  roleMiddleware('PRINCIPAL'),

  rejectContent
);

export default router;