import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';

import roleMiddleware from '../middlewares/role.middleware.js';

import {
  getPendingContent,
  approveContent,
  rejectContent,
} from '../controllers/approval.controller.js';

const router = express.Router();

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