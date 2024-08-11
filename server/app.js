const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const connect = require('./db/config');
const users = require('./db/users');
const dataSchema = require('./db/dataschema'); // Ensure correct import
const error_function = require('./utils/responsehandller').error_function;
const success_function = require('./utils/responsehandller').success_function;

dotenv.config();
connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userexist = await users.findOne({ email });

        if (userexist) {
            let response = error_function({
                statusCode: 400,
                message: 'User already exists'
            });
            return res.status(response.statusCode).send(response.message);
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashed_password = bcrypt.hashSync(password, salt);

            const new_user = await users.create({
                name,
                email,
                password: hashed_password,
            });

            if (new_user) {
                let response = success_function({
                    statusCode: 200,
                    message: "User created successfully"
                });
                return res.status(response.statusCode).send(response.message);
            } else {
                let response = error_function({
                    statusCode: 400,
                    message: 'User creation failed'
                });

                return res.status(response.statusCode).send(response.message);
            }
        }
    } catch (error) {
        let response = error_function({
            statusCode: 402,
            message: 'Something went wrong'
        });
        return res.status(response.statusCode).send(response.message);
    }
});

// Signin route
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await users.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "No user found" });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Generate JWT token
            const accessToken = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, { expiresIn: "1d" });

            return res.status(200).json({
                token: accessToken,
                message: "Login Successful"
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/api/data', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        console.log("userid", req.user)
        const { date, pH, TSS, TDS, BOD, COD, chloride } = req.body;
        console.log(req.body)
        if (!date || !pH || !TSS || !TDS || !BOD || !COD || !chloride) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const datas = new dataSchema({
            userId,
            date,
            pH,
            TSS,
            TDS,
            BOD,
            COD,
            chloride,
        });

        await datas.save();
        res.status(201).json({ message: 'Data submitted successfully!' });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ message: 'Error submitting data', error: error.message });
    }
});

app.get('/api/getdata', async (req, res) => {
    const { userId } = req.query;
    console.log(userId)
    try {
        const data = await dataSchema.find({ userId });
        console.log(data)
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
