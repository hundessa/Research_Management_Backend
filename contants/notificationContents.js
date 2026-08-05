export const NOTIFICATIONS = {
  // ===========================
  // Research Notifications
  // ===========================
  RESEARCH: {
    SUBMITTED: (title) =>
      `Your research "${title}" has been submitted successfully.`,

    RECEIVED: (title) =>
      `A new research "${title}" has been received.`,

    ASSIGNED_TO_REVIEWER: (title) =>
      `You have been assigned to review "${title}".`,

    REVIEW_SUBMITTED: (title) =>
      `The review for "${title}" has been submitted.`,

    REVIEW_COMPLETED: (title) =>
      `All assigned reviews for "${title}" have been completed.`,

    REVISION_REQUIRED: (title) =>
      `Your research "${title}" requires revisions.`,

    RESUBMITTED: (title) =>
      `Your revised research "${title}" has been resubmitted.`,

    APPROVED: (title) =>
      `Congratulations! Your research "${title}" has been approved.`,

    REJECTED: (title) =>
      `Your research "${title}" has been rejected.`,

    DEFENSE_SCHEDULED: (title, date) =>
      `Your defense for "${title}" has been scheduled on ${date}.`,

    DEFENSE_UPDATED: (title, date) =>
      `The defense schedule for "${title}" has been updated to ${date}.`,

    DEFENSE_COMPLETED: (title) =>
      `The defense for "${title}" has been completed.`,

    FINAL_APPROVED: (title) =>
      `Your research "${title}" has received final approval.`,

    PUBLISHED: (title) =>
      `Your research "${title}" has been published.`,
  },

  // ===========================
  // Finance Notifications
  // ===========================
  FINANCE: {
    REQUEST_SUBMITTED: (title) =>
      `Your finance request for "${title}" has been submitted.`,

    REQUEST_RECEIVED: (title) =>
      `A new finance request for "${title}" requires your review.`,

    REQUEST_APPROVED: (title) =>
      `Your finance request for "${title}" has been approved.`,

    REQUEST_REJECTED: (title) =>
      `Your finance request for "${title}" has been rejected.`,

    FUNDS_RELEASED: (title, amount) =>
      `${amount} has been released for "${title}".`,

    PAYMENT_COMPLETED: (title) =>
      `Payment for "${title}" has been completed.`,
  },

  // ===========================
  // Progress Report Notifications
  // ===========================
  PROGRESS: {
    SUBMITTED: (title) =>
      `Your progress report for "${title}" has been submitted.`,

    RECEIVED: (title) =>
      `A new progress report for "${title}" has been submitted.`,

    APPROVED: (title) =>
      `Your progress report for "${title}" has been approved.`,

    REJECTED: (title) =>
      `Your progress report for "${title}" has been rejected.`,

    REVISION_REQUIRED: (title) =>
      `Your progress report for "${title}" requires revision.`,
  },

  // ===========================
  // Reviewer Notifications
  // ===========================
  REVIEWER: {
    ASSIGNED: (title) =>
      `You have been assigned to review "${title}".`,

    DEADLINE_REMINDER: (title, date) =>
      `Reminder: Your review for "${title}" is due on ${date}.`,

    REVIEW_ACCEPTED: (title) =>
      `Your review for "${title}" has been accepted.`,

    REVIEW_REJECTED: (title) =>
      `Your review for "${title}" has been rejected.`,
  },

  // ===========================
  // User Account Notifications
  // ===========================
  USER: {
    ACCOUNT_CREATED: () =>
      `Your account has been created successfully.`,

    PASSWORD_CHANGED: () =>
      `Your password has been changed successfully.`,

    PASSWORD_RESET: () =>
      `Your password has been reset successfully.`,

    PROFILE_UPDATED: () =>
      `Your profile has been updated successfully.`,

    ACCOUNT_ACTIVATED: () =>
      `Your account has been activated.`,

    ACCOUNT_DEACTIVATED: () =>
      `Your account has been deactivated.`,
  },

  // ===========================
  // System Notifications
  // ===========================
  SYSTEM: {
    MAINTENANCE: () =>
      `The system will undergo scheduled maintenance.`,

    MAINTENANCE_COMPLETED: () =>
      `System maintenance has been completed.`,

    NEW_ANNOUNCEMENT: (title) =>
      `New announcement: ${title}.`,

    GENERAL: (message) => message,
  },
};


export const NOTIFICATION_TYPES = {
  RESEARCH: "research",
  FINANCE: "finance",
  PROGRESS: "progress",
  REVIEW: "review",
  USER: "user",
  SYSTEM: "system",
};