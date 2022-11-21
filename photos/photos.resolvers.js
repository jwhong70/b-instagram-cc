import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
  Hashtag: {
    photos: ({ id }, { offset }, { loggedInUser }) => {
      return client.hashtag.findUnique({ where: { id } }).photos();
    },
    totalPhotos: ({ id }) =>
      client.photo.count({ where: { hashtags: { some: { id } } } }),
  },
};
