const Submission = require('../models/Submission');
const { getNats } = require('../config/nats');
const { StringCodec } = require('nats');

const sc = StringCodec();

exports.submitWork = async (req, res) => {
  try {
    const { taskId, workerId, fileUrl } = req.body;

    const newSubmission = await Submission.create({
      taskId,
      workerId,
      fileUrl
    });

    // Publish event: submission.created
    const nats = getNats();
    nats.publish('submission.created', sc.encode(JSON.stringify({
      submissionId: newSubmission.id,
      taskId,
      workerId
    })));

    res.status(201).json({
      message: 'Work submitted successfully',
      submission: newSubmission
    });
  } catch (error) {
    console.error('Submit work error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.reviewSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = status;
    await submission.save();

    // If approved, publish event: submission.approved
    if (status === 'approved') {
      const nats = getNats();
      nats.publish('submission.approved', sc.encode(JSON.stringify({
        submissionId: submission.id,
        taskId: submission.taskId,
        workerId: submission.workerId
      })));
    }

    res.status(200).json({
      message: `Submission ${status} successfully`,
      submission
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
