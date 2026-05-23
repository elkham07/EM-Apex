const Profile = require('../models/Profile');

// Called automatically by NATS subscriber
exports.updateProfileXP = async (data) => {
  const { workerId, amount } = data;
  
  try {
    let profile = await Profile.findOne({ where: { workerId } });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await Profile.create({ workerId });
    }

    // Update stats: 10 XP per dollar
    const earnedXp = Math.floor(amount * 10);
    
    profile.totalEarnings = parseFloat(profile.totalEarnings) + parseFloat(amount);
    profile.xp += earnedXp;

    // Level up logic (every 1000 XP = 1 Level)
    profile.level = Math.floor(profile.xp / 1000) + 1;

    await profile.save();
    console.log(`Worker ${workerId} updated: +$${amount}, +${earnedXp} XP (Level ${profile.level})`);
  } catch (error) {
    console.error('Profile update failed:', error);
  }
};

// REST API to view profile
exports.getProfile = async (req, res) => {
  try {
    const { workerId } = req.params;
    let profile = await Profile.findOne({ where: { workerId } });
    
    if (!profile) {
      // Return default profile if not created yet
      return res.status(200).json({ workerId, totalEarnings: 0, xp: 0, level: 1 });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
