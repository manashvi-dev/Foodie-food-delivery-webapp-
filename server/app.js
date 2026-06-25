if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const userRoute = require("./routes/user");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

app.use("/api/user",userRoute);
app.use("/api/restaurants", require("./routes/restaurant"));
app.use("/api/restaurants/:rId/menu", require("./routes/menu"));
app.use("/api/orders",require("./routes/order"));

app.listen(3000,()=>{
    console.log("server is listening");
});



app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;

    return res.status(status).json({
        msg: message
    });
});