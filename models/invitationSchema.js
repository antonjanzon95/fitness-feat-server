const mongoose = require('mongoose');

const InvitationEnum = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
};

const invitationSchema = new mongoose.Schema(
  {
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inviteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: Object.values(InvitationEnum),
      default: InvitationEnum.PENDING,
    },
  },
  { timestamps: true }
);

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = { Invitation, InvitationEnum };
