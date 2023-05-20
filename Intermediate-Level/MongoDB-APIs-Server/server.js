import * as dotenv from 'dotenv'
import express from 'express';
import bcrypt from 'bcryptjs';
import { format } from 'date-fns';
import mongoose, { Schema, Types } from 'mongoose';
import { CONSTANTS, DB_SCHEMA } from './helpers/constants.js';

const app = express();

app.use(express.json());
dotenv.config();

mongoose.set('strictQuery', false);

const modelSchema = new Schema(DB_SCHEMA);
const collectionModel = mongoose.model('Alphabets', modelSchema) || mongoose.models.Alphabets;

app.post('/database/users/register', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);

    await collectionModel.create({
      email: req.body?.email,
      password: bcrypt.hashSync(req.body?.password, bcrypt.genSaltSync(10)),
      first_name: req.body?.firstName,
      last_name: req.body?.lastName,
      created_at: new Date().toISOString(),
      start_activity_date: new Date().toISOString(),
    });

    res.send({
      message: `Created ${req.body?.firstName} ${req.body?.lastName} user successfully!`,
    });
  } catch (error) {
    res.status(error.status || 400).send({
      error: error.message,
    });
  };
});

app.post('/database/users/login', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);

    const user = await collectionModel.findOne({
      email: req.body?.email,
    });

    if (!user) {
      const customErr = new Error(`No user was found with this email ${req.body?.email}.`);
      customErr.status = 404;
      throw customErr;
    }
    if (!bcrypt.compareSync(req.body?.password, user.password)) {
      throw new Error('Collection name is not found! Please call this API with a body that has a "collectionName" parameter.');
    }
    delete user.password;

    const { start_activity_date: activityDateUpdated } = await collectionModel.findOneAndUpdate({
      email: req.body?.email,
    }, {
      $set: {
        start_activity_date: new Date().toISOString(),
      }
    }, {
      returnDocument: 'after',
    });

    res.send({
      message: `User has logged in successfully! ${user.first_name} ${user.last_name} user successfully!`,
      user: {
        userId: user._id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
        startActivityDate: activityDateUpdated,
      },
    });
  } catch (error) {
    res.status(error.status || 400).send({
      error: error.message,
    });
  };
});

app.get('/database/users', async (req, res) => {
  try {
    let newUser;

    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);

    const users = await collectionModel.find({
      created_at: {
        $lte: format(new Date(req.query?.createdAt), 'yyyy-MM-dd') || format(new Date(), 'yyyy-MM-dd'),
      }
    }, {
      email: true,
      first_name: true,
      last_name: true,
      created_at: true,
    }).limit(50).sort('-created_at');

    const usersFormatted = users.map((user) => {
      newUser = {
        userId: user._id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
      };
      return newUser;
    });

    const nextFilterDate = users.length ? format(new Date(users[users.length - 1]?.created_at), 'yyyy-MM-dd') : '';

    res.send({ users: usersFormatted, next: `http://${req.headers?.host}${req.path}?createdAt=${nextFilterDate}` });
  } catch (error) {
    res.status(error.status || 400).send({
      error: error.message,
    });
  };
});

app.get('/database/users/:userId', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);

    const user = await collectionModel.findById(Types.ObjectId(req.params.userId), {
      email: true,
      first_name: true,
      last_name: true,
      created_at: true,
      start_activity_date: true,
      last_activity_date: true,
    });
    res.send({
      userId: user._id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      startActivityDate: user.start_activity_date,
      lastActivityDate: user.last_activity_date,
    });
  } catch (error) {
    res.status(error.status || 400).send({
      error: error.message,
    });
  };
});

app.get('/database/users/:userId/logout', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);

    await collectionModel.updateOne({ _id: Types.ObjectId(req.params.userId) }, {
      $set: {
        last_activity_date: new Date().toISOString(),
      }
    });
    res.send({ message: 'The user has successfully logged out!' });
  } catch (error) {
    res.status(error.status || 400).send({
      error: error.message,
    });
  };
});

app.listen(CONSTANTS.PORT, () =>
  console.log(`The server is running on port ${CONSTANTS.PORT}`),
);

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => process.on(signal, () => {
  mongoose.disconnect();
  process.exit(0);
}));
