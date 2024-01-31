import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./Header"

const AdminPanel = () => {

  const [tr,setTr]=useState(true)
  const [prod,setProd]=useState<any>([])
  const [updatedProd,setUpdatedProd]=useState<any>(null)
  const[newProduct,setNewProduct]=useState(false)
  const[newProduct2,setNewProduct2]=useState(false)
  const[newProduct3,setNewProduct3]=useState(false)
  const[newProduct4,setNewProduct4]=useState(false)

  const [newProductName,setnewProductName]=useState('')
  const [newProductPrice,setnewProductPrice]=useState('')
  const [newProductPath,setnewProductPath]=useState('')

  const [editProduct,setEditproduct]=useState(false)
  const [selectedToEdit,setSelectedToEdit]=useState<any>({})

  const [editName,setEditName]=useState(true)
  const [editPrice,setEditPrice]=useState(true)
  const [editPath,setEditPath]=useState(true)

  const [editedName,setEditedName]=useState('')
  const[editedPrice,setEditedPrice]=useState('')
  const[editedPath,setEditedPath]=useState('')
  const[editedId,setEditedId]=useState(null)

  const navigate=useNavigate()
  const exitFunction=()=>{
    navigate('/Home')
}


  const productDetail2=()=>{
    if(newProductName!=''){
      setNewProduct(false)
      setNewProduct2(true)

    }else{
      alert('Product name required!')
    }
  }
  const productDetail3=()=>{
    if(newProductPrice!=''){
    setNewProduct(false)
    setNewProduct3(true)
    setNewProduct2(false)
    }else{
      alert('Product Price required!')
    }
}

  const productDetail4=()=>{
    if(newProductPath!=''){
    setNewProduct3(false)
    setNewProduct(false)
    setUpdatedProd({"name":newProductName,"price":JSON.parse(newProductPrice),"imagePath":newProductPath})
    setNewProduct4(true)
    
    
    }else{
      alert('Product image path required!')
    }  
}
const productDetail5=async()=>{
  console.log(updatedProd)
    setNewProduct4(false)
    setnewProductName('')
    setnewProductPrice('')
    setnewProductPath('')
    
    console.log(updatedProd) 

    try {
      const response = await fetch("http://localhost:5000/api/shopping", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProd)
      });

      const responseData = await response.json();
      console.log(responseData)
    } catch (error) {
      console.error('Error adding product:', error);
     
    }
    setTr(!tr)
}


  const deleFunction=async (id:any)=>{
    try{
      const response=await fetch(`http://localhost:5000/api/shopping/${id}`,{
            method:'DELETE'
      })
      const status=await response.json()
      console.log(status)
    }catch(e){
      console.log(e)
    }
    setTr(!tr)
  }

  const editFunction=(product:any)=>{
      setEditproduct(true)
      setSelectedToEdit(product)
      setEditedName(product.name)
      setEditedPrice(product.price)
      setEditedPath(product.imagePath)
      setEditedId(product.id)
  }

  const updateEditFunction=async()=>{
    if(editedId!=null){
    try{
    const response=await fetch(`http://localhost:5000/api/shopping/${editedId}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name:editedName,price:editedPrice,imagePath:editedPath})
    })
    if(response.ok){
    const data=await response.json()
    console.log(data)
    }else{
      console.log("Failed to edit")
    }
  }
  catch(e){
    console.log(e)
  }
    }
    setEditproduct(false)
    setTr(!tr)
  }

  useEffect(() => {
    const fun = async () => {
        const response = await fetch('http://localhost:5000/api/shopping')
        const products = await response.json()
        console.log(products.products)
        setProd(products.products)
    }
    fun()
  }, [tr])


const exitFun=()=>{
    setEditproduct(false)
    setEditName(true)
    setEditPrice(true)
    setEditPath(true)
}

const newProductExit=()=>{
  setNewProduct(false)
  setNewProduct2(false)
  setNewProduct3(false)
  setNewProduct4(false)
}


  return (
    <div>
      
    <div className={newProduct||newProduct2||newProduct3||newProduct4||editProduct?"backdrop":"none"}>
    <div className="divv">
      <div className="top-div">       
        <button className="count-btn" onClick={exitFunction}>Back</button>
        <button onClick={()=>setNewProduct(true)} className="count-btn">Add+</button>
      </div>
      
        {
          prod.map((a:any)=>
          <div>
          <div key={a.id} className="panel-items">
            <div className="item-div">
            <img className="panel-img" src={a.imagePath}/>
            <h3>{a.name}</h3>
            <p>{a.price}$</p>
            </div>
            <div>
                <button className="count-btn" onClick={()=>editFunction(a)}>Edit</button>
                <button className="count-btn" onClick={()=>deleFunction(a.id)}>Delete</button>
            </div>
          </div></div>
          )
        }
    </div>
    </div>
    {newProduct&&<div className="product-detail1">
      <button onClick={newProductExit} className="exit-btn">x</button>
        <label>Enter the product name:</label>
        <input value={newProductName} onChange={(e)=>setnewProductName(e.target.value)} className="input-bar2"/>
        <button onClick={productDetail2}  className="count-btn">Next</button>
    </div>}
    {newProduct2&&<div className="product-detail1">
    <button className="exit-btn">x</button>
        <label>Enter the product price:</label>
        <input value={newProductPrice} onChange={(e)=>setnewProductPrice(e.target.value)} className="input-bar2"/>
        <button onClick={productDetail3}  className="count-btn">Next</button>
    </div>}
    {newProduct3&&<div className="product-detail1">
    <button className="exit-btn">x</button>
        <label>Enter the product image path:</label>
        <input value={newProductPath} onChange={(e)=>setnewProductPath(e.target.value)} className="input-bar2"/>
        <button onClick={productDetail4} className="count-btn">next</button>
    </div>}
    {newProduct4&&<div className="product-detail1">
    <button className="exit-btn">x</button>
      <p>Click create to add {newProductName}</p>
        <button onClick={productDetail5} className="count-btn">Create</button>
    </div>}
    {
        editProduct&&<div className="edit-block">
          <button onClick={exitFun} className="exit-btn">x</button>
          <div className="edit-div1">
          {editName?<div className="edit-div">
              <div><p className="p-tag"><b>Name: </b>{editedName}</p><button className="count-btn "  onClick={()=>setEditName(false)}>Edit Product Name</button></div>
          </div>:<div className="edit-div">
              <div><input className="input-bar1" value={editedName} onChange={(e)=>setEditedName(e.target.value)}/><br></br><button className="count-btn" onClick={()=>setEditName(true)}>save changes</button></div>
          </div>}
          {editPrice?<div className="edit-div">
              <div><p className="p-tag"><b>Price: </b>{editedPrice}</p><button className="count-btn " onClick={()=>setEditPrice(false)}>Edit Product Price</button></div>
          </div>:<div className="edit-div">
              <div><input className="input-bar1" value={editedPrice} onChange={(e)=>setEditedPrice(e.target.value)}/><br></br><button className="count-btn" onClick={()=>setEditPrice(true)}>save changes</button></div>
          </div>}
          {editPath?<div className="edit-div">
              <div><p className="p-tag"><b>Path: </b>{editedPath}</p><button className="count-btn " onClick={()=>setEditPath(false)}>Edit Image Path</button></div>
          </div> :<div className="edit-div">
              <div><input className="input-bar1" value={editedPath} onChange={(e)=>setEditedPath(e.target.value)}/><br></br><button className="count-btn" onClick={()=>setEditPath(true)}>save changes</button></div>
          </div>}
          </div><button className="count-btn" onClick={updateEditFunction}>Update</button>  
        </div>
    }
    </div>
  )
}

export default AdminPanel



