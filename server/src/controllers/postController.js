import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find().populate("authorId", "name");
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("authorId", "name");
  res.json(post);
};

export const createPost = async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.user._id
  });
  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.authorId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not owner" });

  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();
  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.authorId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not owner" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
