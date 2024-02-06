import express from "express";
import cors from "cors";
const cookieParser = require('cookie-parser');

import { Sequelize, DataTypes, where } from "sequelize";
const JWTPRIVATEKEY = "72e7b52a5f8c4a9e8d24a1044b0a3d4d9e31257a1e6a58e2a76b2dc00e5a1a27"

const jwt = require('jsonwebtoken')

const app = express()
app.use(cookieParser());

app.use(express.json())
const allowedOrigin = 'http://localhost:5173'
app.use(cors({credentials: true, origin: allowedOrigin}))


const sequelize = new Sequelize({
  dialect: "postgres",
  username: "olzcjdlz",
  password: "tfe7IH7Iv8QpBCp-p2OrKl6rGrTRJXgZ",
  database: "olzcjdlz",
  host: "arjuna.db.elephantsql.com",
  port: 5432,
});

const Product = sequelize.define("ProductNew", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },quantity:
  {
    type:DataTypes.INTEGER,
    allowNull:false
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const users = sequelize.define("logins", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
});

const favourites:any = sequelize.define("favourite", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:1
  }
});



app.post('/api/shopping/username', async (req, res) => {
  try {
    const { email, user, pass } = req.body
    const isAdmin=false

    const existingEmail = await users.findOne({ where: { email } })
    const existingUser = await users.findOne({ where: { user } })
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }


    const createdUser = await users.create({ email, user, pass,isAdmin });

    res.status(201).json({ message: 'User added successfully', user: createdUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const authenticationToken = (req: any, res: any, next: any) => {
  

 
  const authHeader = req.cookies['accessToken']
  
  if (!req.cookies || !req.cookies["accessToken"]) {
    return res.status(401).json({ message: "unauthorized" })
  }
  const token = req.cookies["accessToken"];
  jwt.verify(token, JWTPRIVATEKEY, (err: any) => {
    if (err) {
      return res.status(401).json({ message: "unauthorized" })
    }
    next()
  })
}

app.post("/api/shopping/login", async (req, res) => {
  const { email, user, pass } = req.body
  try {
    const usersData: any = await users.findOne({ where: { email } });
    const isAdmin=usersData.isAdmin
    if ((user == usersData.user) && (pass == usersData.pass)) {
      const accessToken = jwt.sign(usersData.toJSON(), JWTPRIVATEKEY, { expiresIn: "1d" })
      console.log("accessTokenaccessToken", accessToken)
      res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000, path: '/', secure: true })
      res.json({ message: "success", usersData, accessToken: accessToken,isAdmin });
    }
    else {
      res.status(400).json({ message: "incorrect" })
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/shopping",authenticationToken, async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json({ message: "success", products })
    console.log("Token in Request Headers:", req.headers['accessToken']);
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
})



app.post('/api/shopping',authenticationToken,  async (req, res) => {
  try {
    const newProducts = req.body;
    const createdProducts = await Product.create(newProducts);
    res.json({ message: 'Products added successfully', products: createdProducts });
  } catch (error) {
    console.error('Error adding products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/shopping/:id',authenticationToken, async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await Product.destroy({
      where: {
        id: id
      }
    })
    res.status(200).json({ message: "product deleted sucessfully" })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Internal server Error" })
  }
})

app.put('/api/shopping/:id',authenticationToken, async (req, res) => {
  const { id } = req.params
  const { name, price,quantity, imagePath } = req.body

  try {
    const updatedProduct = await Product.update(
      {
        name: name,
        price: price,
        quantity:quantity,
        imagePath: imagePath,
      }, {
      where: {
        id: id
      }
    }
    )
    res.status(200).json({ message: "Edited successfully" })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Internal server error" })
  }
})




app.get("/api/shopping/username/favourites",authenticationToken, async (req, res) => {
  try {

    const favourieArry = await favourites.findAll()
    res.json({ message: "success", favourieArry })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
});

app.post("/api/shopping/username/favourites",authenticationToken, async (req, res) => {
  try {
    const { user, productName } = req.body;

    const [existingProduct,created] = await favourites.findOrCreate({ where: { user:user,productName:productName },defaults:{quantity:1 }})
    if(!created){
      existingProduct.quantity+=1
      await existingProduct.save()
    }
    const requiredProduct:any=await Product.findOne({
      where:{name:productName}
    })
    const requiredQuantity=requiredProduct.quantity
    if(requiredQuantity>=1){
    const changedQuantity=requiredQuantity-1
    const response= await Product.update({        
        quantity:changedQuantity
      },{
      where:{
        name:productName
      }
    })
    }

  
      res.status(201).json({ message: 'New user added with favourites array'})
  } catch (error) {
    console.error("Error updating favourites array:", error);
    res.status(500).json({ message: "Internal Server Error" })
  }
});



app.put("/api/shopping/username/favourites", async (req, res) => {
  try {
    const { user, productName, calc } = req.body

    const favouriteProduct = await favourites.findOne({ where: { user, productName } })
    const requiredProduct:any = await Product.findOne({ where: { name: productName } })
    if (!favouriteProduct) {
      return res.status(404).json({ message: "Favourite product not found" })
    }

    let updatedQuantity:any
    let changedQuantity:any
    if (calc == "minus"&&favouriteProduct.quantity > 1) {
      updatedQuantity = await favouriteProduct.quantity - 1 ;
      changedQuantity =await requiredProduct.quantity + 1
    } else if (calc === "plus"&&requiredProduct.quantity!=0) {
      updatedQuantity =await favouriteProduct.quantity + 1
      changedQuantity =await requiredProduct.quantity - 1 ;
    } else {
      return res.status(400).json({ message: "Invalid calc value" })
    }

    favouriteProduct.quantity =await updatedQuantity
    await favouriteProduct.save()

    requiredProduct.quantity =await changedQuantity
    await requiredProduct.save();

    if (!requiredProduct) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json({ message: "Update successful" });
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Internal server error" });
  }
})





app.delete("/api/shopping/username/favourites",authenticationToken,async (req,res)=>{
    try{
      const user=req.query.param1
      const productName=req.query.param2
      const selected=await favourites.findOne({where:{
        user:user,
        productName:productName
    }})

      const requiredProduct:any=await Product.findOne({
        where:{name:productName}
      })
      const requiredQuantity=requiredProduct.quantity
      
      const changedQuantity=requiredQuantity+selected.quantity
      const response= await Product.update({        
          quantity:changedQuantity
        },{
        where:{
          name:productName
        }
      })
      const deleted=await favourites.destroy({where:{
          user:user,
          productName:productName
      }})
      res.status(200).json({message:"product successfully removed from cart"})
      
     
    }catch(e){
      console.log(e)
      res.status(500).json({message:"Internal server error"})
    }
})
   

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log("Server running on localhost:5000");
  });
});









// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import shoppingRoutes from "./routes/shoppingRoutes";
// import { sequelize } from "./models";

// const app = express();
// app.use(cookieParser());
// app.use(express.json());
// app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

// app.use("/api/shopping", shoppingRoutes);



// sequelize.sync().then(() => {
//   app.listen(5000, () => {
//     console.log("Server running on localhost:5000");
//   });
// });














