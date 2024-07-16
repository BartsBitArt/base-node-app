const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            username,
            password: hashPassword
        });
        req.session.user = user;
        res.status(201).json({
            status: "success",
            data: {
                user
            }})
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: "fail",
            message: e
        })
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User does not exist"
            })
        }
        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect password"
            })
        }
        req.session.user = user;
        res.status(200).json({
            status: "success",
            data: {
                user
            }})
    } catch (e) {
        res.status(400).json({
            status: "fail",
            message: e
        })
    }
}