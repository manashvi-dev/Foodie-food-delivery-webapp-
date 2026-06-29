 require("dotenv").config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const userRoute = require("./routes/user");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }
});

app.set("io", io);

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

io.on("connection",(socket)=>{
    console.log("Client connected:",socket.id);

    socket.on("joinOrder",(orderId)=>{
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} joined order_${orderId}`);
    });

    socket.on("joinRestaurant",(restaurantId)=>{
        socket.join(`restaurant_${restaurantId}`);
        console.log(`Socket ${socket.id} joined restaurant_${restaurantId}`);
    });

    socket.on("joinAgent",(agentId)=>{
        socket.join(`agent_${agentId}`);
        console.log(`Socket ${socket.id} joined agent_${agentId}`);
    });

    socket.on("disconnect",()=>{
        console.log("Client disconnected:",socket.id);
    });
})

app.use("/api/user",userRoute);
app.use("/api/restaurants", require("./routes/restaurant"));
app.use("/api/restaurants/:rId/menu", require("./routes/menu"));
app.use("/api/orders",require("./routes/order"));


app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;

    return res.status(status).json({
        msg: message
    });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});