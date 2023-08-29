const mongoose = require('mongoose');

const NotificationEnum = {
  INVITATION: 'invitation',
  SYSTEM_MESSAGE: 'system_message',
};

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationEnum),
      default: NotificationEnum.SYSTEM_MESSAGE,
    },
    invitationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invitation',
      validate: {
        validator: function (v) {
          return !(this.type === NotificationEnum.INVITATION && !v);
        },
        message: (props) => `invitationId is required when type is INVITATION`,
      },
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Notification, NotificationEnum };
