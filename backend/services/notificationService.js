const Notification = require("../models/Notification");

class NotificationService {

  async create(data) {
    try {
      const notification = new Notification(data);
      return await notification.save();
    } catch (e) {
      console.error("Notification error:", e);
      return null;
    }
  }

  // OWNER / ADMIN NOTIFICATIONS

  async notifyDownload(ownerId, userName, appName) {
    return this.create({
      userId: ownerId,
      message: `${userName} downloaded ${appName}`
    });
  }

  async notifyReview(ownerId, userName, appName, rating) {
    return this.create({
      userId: ownerId,
      message: `${userName} rated ${appName} ${rating} stars`
    });
  }

  async notifyRegister(ownerId, userName) {
    return this.create({
      userId: ownerId,
      message: `${userName} just registered`
    });
  }

  async notifyLogin(ownerId, userName) {
    return this.create({
      userId: ownerId,
      message: `${userName} logged in`
    });
  }

  // USER NOTIFICATIONS

  async notifyUserInstall(userId, appName) {
    return this.create({
      userId,
      message: `You successfully installed ${appName}`
    });
  }

  async notifyUserReviewAdded(userId, appName, rating) {
    return this.create({
      userId,
      message: `Your ${rating}★ review on ${appName} was added successfully`
    });
  }

  async notifyUserReviewEdited(userId, appName) {
    return this.create({
      userId,
      message: `Your review on ${appName} was updated`
    });
  }

  async notifyUserReviewDeleted(userId, appName) {
    return this.create({
      userId,
      message: `Your review on ${appName} was deleted`
    });
  }

  // GET UNREAD NOTIFICATIONS

  async getUnread(userId) {
    return Notification.find({
      userId,
      isRead: false
    }).sort({ createdAt: -1 }).limit(50);
  }

  // GET ALL NOTIFICATIONS

  async getAll(userId, page = 1, limit = 20) {

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ userId });

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

  }

  // MARK ONE AS READ

  async markAsRead(id) {

    await Notification.findByIdAndUpdate(
      id,
      { isRead: true }
    );

    return Notification.findById(id);

  }

  // MARK ALL AS READ

  async markAllAsRead(userId) {

    return Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

  }

  // DELETE NOTIFICATION

  async delete(id) {
    return Notification.findByIdAndDelete(id);
  }

}

module.exports = new NotificationService();