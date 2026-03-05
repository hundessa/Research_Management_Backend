export const sendNotification = async ({
  recipient,
  message,
  researchId,
  researcher,
  title,
  type,
  file,
  recipientRole,
}) => {
  if (!message || !recipientRole) throw new AppError("Message and recipient role are required", 400);

  const notification = new Notification({
    recipient,
    message,
    researchId,
    researcher,
    title,
    type,
    file,
    recipientRole,
  });

  await notification.save();
  return { message: "Notification sent successfully" };
};