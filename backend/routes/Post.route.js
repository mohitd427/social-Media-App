const express = require("express")
const postRouter = express.Router();
const { PostModel } = require("../models/Post.model")

postRouter.get("/", async (req, res) => {
    const query = req.query;
    try {
        const posts = await PostModel.find();
        res.send(posts)
    } catch (err) {
        console.log(err)
        res.send({ err: "Something went wrong while get request" });
    }
})


postRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        const post = new PostModel(payload);
        await post.save();
        res.send({msg:"Post Created Successsfully"})
    } catch (err) {
        console.log(err);
        res.send({ err: "Something went wrong while Creating Post" });
    }
})

postRouter.patch("/update/:id",async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const post = await PostModel.find({ _id: id });
    const userID_in_post = post.userID;
    const userID_making_req = req.body.userID;
    try {
        if (userID_in_post !== userID_making_req) {
            res.send({msg:"You are not Authorized"})
        } else {
            await PostModel.findByIdAndUpdate({ _id: id }, payload);
            res.send({msg:" Post Updated Successfully"})
        }
    } catch (err) {
        console.log(err)
        res.send({ err: "Something went wrong while Updating" });

    }
    
})

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.find({ _id: id });
  const userID_in_post = post.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_in_post !== userID_making_req) {
      res.send({ msg: "You are not Authorized" });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
      res.send({ msg: " Post Deleted Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.send({ err: "Something went wrong while Deleting" });
  }
});

module.exports = {
    postRouter
}