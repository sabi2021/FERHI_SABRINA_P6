const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/api/auth/login', (req, res) => {
    // TODO: Implement login logic
        const { email, password } = req.body;

        // Validate the user's credentials
        if (email !== 'myemail' || password !== 'mypassword') {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate a JWT
        const token = jwt.sign({ email }, secretKey);

        // Send the JWT back to the client
        res.json({ token });
    });