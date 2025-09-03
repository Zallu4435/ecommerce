const User = require("../model/User");

function calculateExpiryDateFrom(createdAt) {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return new Date(createdAt.getTime() + sevenDaysMs);
}

async function removeExpiredPendingUsers() {
  const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    const result = await User.deleteMany({
      status: "pending",
      createdAt: { $lt: threshold },
    });
    if (result?.deletedCount) {
      console.log(`Cleanup: removed ${result.deletedCount} expired pending users`);
    }
  } catch (err) {
    console.error("Cleanup error removing expired pending users:", err.message);
  }
}

function scheduleUserCleanup() {
  removeExpiredPendingUsers();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  setInterval(removeExpiredPendingUsers, twentyFourHoursMs);
}

module.exports = { scheduleUserCleanup, calculateExpiryDateFrom };


