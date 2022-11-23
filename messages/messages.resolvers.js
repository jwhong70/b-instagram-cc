import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }) => client.message.findMany({ where: { roomId: id } }),
  },
  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
