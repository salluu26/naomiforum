let posts = [
  {
    _id: "1",
    title: "Welcome to Naomi",
    mediaType: "image",
    mediaUrl: "https://via.placeholder.com/900x500",
    likes: [],
    dislikes: [],
    comments: [],
  },
  {
    _id: "2",
    title: "Sample Video Post",
    mediaType: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: [],
    dislikes: [],
    comments: [],
  },
];

export const mockApi = {
  login: async () => ({
    user: { username: "demoUser" },
    token: "demo-token",
  }),

  getPosts: async () => posts,

  getPost: async (id) => posts.find((p) => p._id === id),

  addPost: async (post) => {
    posts.unshift(post);
    return post;
  },

  toggleLike: async (id) => {
    const post = posts.find((p) => p._id === id);
    post.likes.push("x");
    return post;
  },

  addComment: async (id, text) => {
    const post = posts.find((p) => p._id === id);
    post.comments.push({ text });
    return post;
  },
};
