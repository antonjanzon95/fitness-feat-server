const express = require('express');
const router = express.Router();
const { validateAccessToken } = require('../middleware/auth0.middleware');
const { attachUserToRequest } = require('../middleware/attach-user.middleware');
const {
  Notification,
  NotificationEnum,
} = require('../models/notificationsSchema');

router.get(
  '/',
  validateAccessToken,
  attachUserToRequest,
  async (req, res, next) => {
    const { dbUser } = req.user;

    try {
      const notifications = await Notification.find({ userId: dbUser._id });

      res.status(200).json(notifications);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Cannot fetch notifications: ', error });
    }
  }
);

router.post(
  '/read',
  validateAccessToken,
  attachUserToRequest,
  async (req, res, next) => {
    const { notificationId } = req.body;

    try {
      const notification = await Notification.findById(notificationId);

      if (notification.userId.toString() !== dbUser._id.toString()) {
        return res
          .status(403)
          .json({ message: 'Not authorized to read notification.' });
      }

      if (!notification.isRead) {
        notification.isRead = true;
        await notification.save();
      }

      return res.status(200).json(notification);
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Error reading notification: ', error });
    }
  }
);

module.exports = router;
