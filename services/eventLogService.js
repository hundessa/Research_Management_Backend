import EventLog from "../models/eventLogModel.js";

export const createEvent = async ({
  actor,
  action,
  target,
  previousState,
  newState,
  metadata,
}) => {
  const event = new EventLog({
    actor,
    action,
    target,
    previousState,
    newState,
    metadata,
  });

  await event.save();
  return event;
};  