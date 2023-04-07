import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

app.post("/signup", async (req, res) => {
    //TODO
});

app.post("/login", async (req, res) => {
    const user = await getUserByUsername(req.body.username);
    if (!user) {
        return res.status(401).send({ message: "Username incorrect." });
    }

    const isPasswordValid = req.body.password === user.password;
    if (!isPasswordValid) {
        return res.status(401).send({ message: "Password incorrect." });
    }else {
        console.log("Authentification success");
    }

    const token = jwt.sign({ userId: user.id }, "secret");
    res.send({ token });
});

function getUserByUsername(username: string) {
    // Code pour récupérer l'utilisateur dans la base de données
    const users = [
        { id: 1, username: 'user1', password: 'user1' },
        { id: 2, username: 'user2', password: 'user2' },
        { id: 3, username: 'user3', password: 'user3' }
    ];

    const user = users.find(u => u.username === username);
    return user || null;
}