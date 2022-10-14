require(`dotenv`).config();
const express = require(`express`);
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5500;
const mongoose = require(`mongoose`);

// mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
mongoose.connect(`mongodb://127.0.0.1/orders`, {useNewUrlParser: true});
const db = mongoose.connection;
db.on(`error`, (error) => console.error(error));
db.once(`open`, () => console.log(`Connected to database`));

const customerRouter = require(`./routes/customers`);
app.use(`/customers`, customerRouter);
const orderRouter = require(`./routes/orders`);
app.use(`/orders`, orderRouter);

app.get(`/health`, (req, res) => {
   res.send(`You keep using that word. I do not think it means what you think it means.`);
});

app.post(`/neworder`, (req, res) => {
    const body = req.body;
    const item_id= body.item_id;
    const quantity = body.quantity;

    // console.log(body, item_id, quantity);
    res.send(`This is working`);
    // res.sendStatus(201)
});

app.post(`/newcustomer`, (req, res) => {
    const body = req.body;
    const firstName= body.firstName;
    const lastName = body.lastName;
    const age= body.age;
    const streetAddress = body.address.streetAddress;
    const city= body.address.city;
    const state = body.address.state;
    const postalCode= body.address.postalCode;
    const phoneNumber = body.phoneNumber;

    // console.log(body, item_id, quantity);
    res.send(`This is working`);
    // res.sendStatus(201)
    });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;