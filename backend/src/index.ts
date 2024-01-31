import express from "express";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";

const app = express()

app.use(express.json())
app.use(cors())

const sequelize = new Sequelize({
  dialect: "postgres",
  username: "olzcjdlz", 
  password: "tfe7IH7Iv8QpBCp-p2OrKl6rGrTRJXgZ",
  database: "olzcjdlz", 
  host: "arjuna.db.elephantsql.com", 
  port: 5432,
});

const Product = sequelize.define("Product",{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagePath: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const users = sequelize.define("Users",{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const favourites = sequelize.define("favourites",{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  products: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
});
const currentUser=sequelize.define("currentUser",{
    id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      allowNull:false,
      autoIncrement:true
},
    user:{
      type:DataTypes.STRING,
      allowNull:false
    }})

app.get("/api/shopping", async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json({ message: "success", products })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
})



app.post('/api/shopping', async (req, res) => {
  try {
    const newProducts = req.body;
    const createdProducts = await Product.create(newProducts);
    res.json({ message: 'Products added successfully', products: createdProducts });
  } catch (error) {
    console.error('Error adding products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/shopping/:id',async (req,res)=>{
  const {id}=req.params
  try{
    const deleted=await Product.destroy({
      where:{
        id:id
      }
    })
    res.status(200).json({message:"product deleted sucessfully"})
  }catch(e){
    console.log(e)
    res.status(500).json({message:"Internal server Error"})
  }
})

app.put('/api/shopping/:id',async (req,res)=>{
  const {id}=req.params
  const {name,price,imagePath}=req.body
  
  try{
    const updatedProduct=await Product.update(
      {
        name:name,
        price:price,
        imagePath:imagePath,
      },{
        where:{
          id:id
        }
      }
    )
    res.status(200).json({message:"Edited successfully"})
  }catch(e){
    console.log(e)
    res.status(500).json({message:"Internal server error"})
  }
})



app.post('/api/shopping/username', async (req, res) => {
  try {
    const { user, pass } = req.body

   
    const existingUser = await users.findOne({ where: { user } });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const createdUser = await users.create({ user, pass });

    res.status(201).json({ message: 'User added successfully', user: createdUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get("/api/shopping/username", async (req, res) => {
  try {
   
    const usersData = await users.findAll();
    res.json({ message: "success", usersData });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/shopping/username/favourites", async (req, res) => {
  try {
    
    const favourieArry = await favourites.findAll()
    res.json({ message: "success",  favourieArry})
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
});

app.post("/api/shopping/username/favourites", async (req, res) => {
  try {
    const { user, products } = req.body;

    
    const existingUser = await favourites.findOne({ where: { user } })

    if (existingUser) {
      
      await existingUser.update({ products });
      res.json({ message: 'Favourites array updated successfully', favourites: existingUser });
    } else {
      
      const newFavourite = await favourites.create({ user, products });
      res.status(201).json({ message: 'New user added with favourites array', favourites: newFavourite });
    }
  } catch (error) {
    console.error("Error updating favourites array:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/api/shopping/username/favourites/currentuser',async(req,res)=>{
  try{
      const data=await currentUser.findAll()
      res.json({message:'success',requiredUser:data})
  }catch(e){
    console.log(e)
    res.status(500).json({message:"Internal server Error1"})
  }
})
app.post('/api/shopping/username/favourites/currentuser',async(req,res)=>{
  try{
      const {newUser}=req.body
      const one=await currentUser.findOne()
      if(one){
        await one.update({user:newUser})
      }else{
        await currentUser.create({user:newUser})
      }
      res.json({message:"user updated successfully"})
  }catch(e){
    console.error('Error updating current user:', e)
    res.status(500).json({message:"Internal server Error2"})
  }
})

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log("Server running on localhost:5000");
  });
});
