const express = require('express');
const router = express.Router();
const { validateAccessToken } = require('../middleware/auth0.middleware');
const { attachUserToRequest } = require('../middleware/attach-user.middleware');
const { Invitation, InvitationEnum } = require('../models/invitationSchema');
const Challenge = require('../models/challengeSchema');
const User = require('../models/userSchema');

router.get(
  '/',
  validateAccessToken,
  attachUserToRequest,
  async (req, res, next) => {
    const { dbUser } = req.user;

    try {
      const invitations = await Invitation.find({
        userId: dbUser._id,
      }).populate();

      res.status(200).json(invitations);
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Cannot fetch invitations: ', error });
    }
  }
);

router.post(
  '/accept',
  validateAccessToken,
  attachUserToRequest,
  async (req, res, next) => {
    const { dbUser } = req.user;
    const { invitationId } = req.body;

    try {
      const user = await User.findById(dbUser._id);
      if (!user) return res.status(404).json({ message: `Cannot find user.` });

      const invitation = await Invitation.findById(invitationId);

      if (
        invitation.inviteeId.toString() !== user._id.toString() ||
        invitation.status !== InvitationEnum.PENDING
      ) {
        return res
          .status(403)
          .json({ message: 'Invalid invitation or invitation status.' });
      }

      invitation.status = InvitationEnum.ACCEPTED;
      await invitation.save();

      const challenge = await Challenge.findById(invitation.challengeId);
      challenge.participants.push(user._id);
      await challenge.save();

      return res.status(200).json(invitation);
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Error accepting invitation: ', error });
    }
  }
);

router.post(
  '/decline',
  validateAccessToken,
  attachUserToRequest,
  async (req, res, next) => {
    const { dbUser } = req.user;
    const { invitationId } = req.body;

    try {
      const user = await User.findById(dbUser._id);
      if (!user) return res.status(404).json({ message: `Cannot find user.` });

      if (
        invitation.inviteeId.toString() !== user._id.toString() ||
        invitation.status !== InvitationEnum.PENDING
      ) {
        return res
          .status(403)
          .json({ message: 'Invalid invitation or invitation status.' });
      }

      const invitation = await Invitation.findById(invitationId);
      invitation.status = InvitationEnum.DECLINED;
      await invitation.save();

      return res.status(200).json(invitation);
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Error declining invitation: ', error });
    }
  }
);

module.exports = router;
