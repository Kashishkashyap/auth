const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const bcrypt = require('bcrypt');

const User = require('./model/user');

mongoose.connect('mongodb+srv://kashyapkashish22:n5dJXt2Mkmh9BHEw@cybernauts.zea6mni.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DataBase Connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', async (req, res) => {
    res.send("Welcome");
})

app.get('/makeuser', async (req, res) => {
    const user = new User({ first_name: 'Kashish', last_name: 'Kashyap', username: 'kk', email: 'kk@gmail.com', password: 'kk' });
    await user.save();
    res.send(user);
})

app.get('/signup', async (req, res) => {
    res.render('register');
})
app.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, confirm_password } = req.body;
        if (confirm_password !== password) {
            return res.send("Confirm Password and Passsword do not match");
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.send("User with provided email address already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/login', async (req, res) => {
    res.render('login');
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.send("Invalid Credentials");
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.send("Invalid Credentials");
        }
        res.send("Login successful")
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
app.listen(3000, () => {
    console.log("Port 3000")
})