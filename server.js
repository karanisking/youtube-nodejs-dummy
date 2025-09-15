require('dotenv').config()
const express = require('express');
const connectToDB = require('./database/db');
const AuthRoutes = require('./routes/auth-routes');
const HomeRoutes = require('./routes/home-routes');
const AdminRoutes = require('./routes/admin-routes');
const ImageRoutes = require('./routes/image-routes');
connectToDB();


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/auth',AuthRoutes);
app.use('/api',HomeRoutes);
app.use('/api/image',ImageRoutes);
app.use('/api/admin',AdminRoutes);


app.listen(PORT,()=>{
  console.log(`Server is running on ${PORT}`);
});


