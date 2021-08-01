const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId; //pour contrôler que les id sont reconnus par la BDD

//All users
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');//le password ne resortira dans aucune requête Get
    res.status(200).json(users);
}

//One user
module.exports.userInfo = (req, res) => {
    console.log(req.params);
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Id unknown: ' + req.params.id)
    } else {
        UserModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('Id unknown: ' + err)
            }
        }).select('-password')
    }
}

//update oneUser
module.exports.updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id)

    try {                                      //Si l'id passé en paramètre est correct
        await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {
                new: true, upsert: true, setDefaultsOnInsert: true
            },
            (err, docs) => {
                if (!err) return res.send(docs)
                if (err) return res.status(500).send({ message: err })
            }
        )
    } catch {
        return res.status(500).json({ message: err })
    }
}

//deleteUser
module.exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id)

    try {
        await UserModel.deleteOne({ _id: req.params.id }).exec();
        res.status(200).json({ message: 'Succesfully deleted' })
    } catch {
        return res.status(500).json({ message: err })
    }
}

//Follow

module.exports.follow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id)

    try {
        //add to the followers list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            {
                new: true, upsert: true
            },
            (err, doc) => {
                if (!err) res.status(201).json(doc);
                else return res.status(400).json(err);
            }
        );
        //Add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            {
                new: true, upsert: true
            },
            (err, doc) => {
                if (!err) return res.status(400).json(err);
            }
        )
    } catch {
        return res.status(500).json({ message: err })
    }
};



//unFollow

module.exports.unfollow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnfollow))//On vérifie que l'id passé en paramètre est correct
        return res.status(400).send('Id unknown: ' + req.params.id)

    try {
        //remove to the followers list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            {
                new: true, upsert: true
            },
            (err, doc) => {
                if (!err) res.status(201).json(doc);
                else return res.status(400).json(err);
            }
        );
        //remove to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            {
                new: true, upsert: true
            },
            (err, doc) => {
                if (!err) return res.status(400).json(err);
            }
        )
    } catch {
        return res.status(500).json({ message: err })
    }
}