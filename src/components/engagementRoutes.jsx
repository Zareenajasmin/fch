// backend/routes/engagementRoutes.js
const express = require('express');
const { db } = require('../firebaseAdmin');
const router = express.Router();

router.post('/award-points', async (req, res) => {
  const { userId, taskCompleted, hoursLogged } = req.body;

  const userRef = db.collection('engagement').doc(userId);

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    let newPoints = userData.points;

    if (taskCompleted) newPoints += 10;  // Award points for task completion
    if (hoursLogged) newPoints += hoursLogged * 2;  // Award points for hours logged

    await userRef.update({
      points: newPoints,
      tasksCompleted: userData.tasksCompleted + (taskCompleted ? 1 : 0),
      hoursLogged: userData.hoursLogged + (hoursLogged || 0),
    });

    res.status(200).json({ message: 'Points awarded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error awarding points' });
  }
});

module.exports = router;
