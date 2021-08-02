const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get data: ' + err)
    })
}

module.exports.createPost = async (req, res) => {
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        comments: [],
        likers: []
    })
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch {
        return res.status(400).send(err)
    }
}

module.exports.updatePost = (req, res) => {
    if (!ObjectId.isValid(req.params.id))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id);

    const updatedRecord = { message: req.body.message }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log('Update error: ' + err);
        }
    )
}

module.exports.deletePost = (req, res) => {
    if (!ObjectId.isValid(req.params.id))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id);

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs);
            else log.console('Delete error: ' + err)
        }
    )
}

module.exports.likePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(401).send(err);
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.id,
            { $addToSet: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else return res.status(400).send(err);
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.unlikePost = async (req, res) => {
        if (!ObjectId.isValid(req.params.id))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(401).send(err);
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.id,
            { $pull: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else return res.status(400).send(err);
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
}