const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const Teacher = require('../models/Teachers.model');
const ObjectId = require('mongoose').Types.ObjectId;
const Result = require('../models/Results.model')
const config = require('../config/constant')

const isEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailRegex.test(email);
};


exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const payload = {
      user: {
        email: req.body.email
      }
    };

    jwt.sign(payload, config.secret, { expiresIn: 10000 }, async(err, token) => {
      if (!isEmail(email)) {
        throw new Error('Email must be a valid email address.');
      }
      if (typeof password !== 'string') {
        throw new Error('Password must be a string.');
      }
      const teacher = new Teacher({ email, password });
      await teacher.save();

      res.status(201).json({
        token,
        title: 'User Registration Successful',
        detail: 'Successfully registered new user',
      });
    })
  } catch (err) {
    res.status(404)
    throw new Error(err, "Somthing went wrong")
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({
        error: {
          title: "Email must be valid"
        }
      })
    }
    if (typeof password !== 'string') {
      return res.status(400).json({
        errors: [
          {
            title: 'Bad Request',
            detail: 'Password must be a string',
          },
        ],
      });
    }
    //queries database to find a user with the received email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      throw new Error();
    }

    //using bcrypt to compare passwords
    const passwordValidated = await bcrypt.compare(password, teacher.password);
    if (!passwordValidated) {
      throw new Error();
    }
    res.status(200)
    res.json({
      title: 'Login Successful',
      detail: 'Successfully validated user credentials',
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Invalid Credentials',
        },
      ],
    });
  }
}

exports.putResult = async (req, res) => {
  try {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ message: 'No token provided.' });

    jwt.verify(token, config.secret, async(err, data) => {
      if (!err) {

        const { name, registerNo, Subject1, Subject2, Subject3 } = req.body;
        const result = new Result({ name, registerNo, Subject1, Subject2, Subject3 });
        await result.save((err, data) => {
          if (err) {
            throw err
          }
        })
        res.status(201).json({
          title: 'Response Successful',
        });
      }
    })
  } catch (err) {
    res.status(404)
    throw new Error(err, "Somthing went wrong")
  }
}

exports.allResults = async (req, res) => {
  try {
    //  queries database to find a all results
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No Token Where Provided" })
    jwt.verify(token, config.secret, async(err, data) => {
      if (!err) {
        await Result.find({}, (err, data) => {
          if (!err) {
            res.status(201).json({
              title: 'Response Successful',
            });
          }
        })
      }
    })
  } catch (err) {
    res.status(404)
    throw new Error(err, "Somthing went wrong")
  }
}


exports.singleResult = async (req, res) => {
  try {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No Token Where Provided" })

    jwt.verify(token, config.secret, async(err, data) => {
      if (!err) {
        console.log(req.params.id)
        if (!ObjectId.isValid(req.params.id)) {
          res.send('Thers is no such user')
        } else {
          //  queries database to find a single 

          await Result.findById(req.params.id, (err, data) => {
            if (!err) {
              res.send(data)
              res.status(200).json({
                title: 'Response Successful'
              })
            }
          })
        }
      }
    })
  } catch (err) {
    res.status(404)
    throw new Error(err, "Somthing went wrong")
  }
}


exports.editResult = async (req, res) => {
  try {

    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No Token Where Provided" })
    jwt.verify(token, config.secret, async(err, data) => {
      if (!err) {

        if (!ObjectId.isValid(req.params.id)) {
          res.send('Thers is no such user')
        } else {
          var res = {
            name: req.body.name,
            registerNo: req.body.registerNo,
            Subject1: req.body.Subject1,
            Subject2: req.body.Subject2,
            Subject3: req.body.Subject3,

          }
          //  queries database to find a single  and update

          await Result.findByIdAndUpdate(req.params.id, { $set: res }, { upsert: true }, (err, data) => {
            if (!err) {
              res.send(data)
              res.status(200).json({
                title: 'Response Successful'
              })
            } else {
              res.status(404)
              throw new Error(err, "Somthing went wrong")
            }
          })
        }
      }
    })
  } catch (err) {
    res.status(404)
    throw new Error(err, "Somthing went wrong")
  }
}


exports.deleteResult = async (req, res) => {
  try {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No Token Where Provided" })

    jwt.verify(token, config.secret, async(err, data) => {
      if (!err) {
        if (!ObjectId.isValid(req.params.id)) {
          res.send('Thers is no such user')
        } else {
          //  queries database to find a single  and delete

          await Result.findById(req.params.id, (err, data) => {
            if (!err) {
              res.send(data)
              res.status(200).json({
                title: 'Record deleted sucessfully'
              })
            } else {
              res.status(404)
              throw new Error(err, "Somthing went wrong")
            }
          })
        }
      }
    })
  } catch (err) {
    res.status(404)
    throw new Error(err, "Somthing went wrong")
  }
}