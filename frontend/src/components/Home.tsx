import { useState, useEffect } from "react"
import Header from "./Header"

interface HomeProps {
    currentUser: any;
}


const Home: React.FC<HomeProps> = ({ currentUser }) => {
    const [profile, setProfile] = useState<boolean>(true)
    const [products, setProducts] = useState([])
    const [fav, setFav] = useState<any>([])
    const [arry, setArry] = useState<any[]>([])
    const [count, setCount] = useState<number>(0)
    const [cuUser,setCuUser]=useState(sessionStorage.getItem('currentUser'))
    console.log(cuUser)

    const [tr,setTr]=useState(true)
    console.log(arry)
    
    useEffect(() => {
        const set = new Set(fav)
        setCount(set.size)
    }, [arry])
    useEffect(() => {
        const fun = async () => {
            const response = await fetch('http://localhost:5000/api/shopping')
            const products = await response.json()
            console.log(products.products)
            setProducts(products.products)
            setTr(!tr)
        }
        fun()
    }, [])

    const favouriteProfile = () => {
        setProfile(false)
        console.log(`hi i am ${cuUser}`)
    }

    const newFavourite = async (e: any) => {
        const response = await fetch('http://localhost:5000/api/shopping/username/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: cuUser, products: [...arry, e] })
        })
        const newArry = await response.json()
        setArry(newArry.favourites.products)
        console.log(newArry.favourites.products)
        setTr(!tr)
    }
    const removefavourite = async (e: any) => {
        const remove = arry.filter((a) => a != e)
        setArry(remove)
        console.log(remove)
        const response = await fetch('http://localhost:5000/api/shopping/username/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: cuUser, products: remove })
        })
        const newArry = await response.json()
        setArry(newArry.favourites.products)
        console.log(newArry.favourites.products)
        setTr(!tr)
    }
    useEffect(() => {
        const NewFav = async () => {
            const response2 = await fetch('http://localhost:5000/api/shopping/username/favourites')
            const getFavourites = await response2.json()
            const ar = getFavourites.favourieArry.filter((a: any) => a.user == cuUser)
            const FavouriteItems = ar[0].products
            setArry(FavouriteItems)
            const fav = products.filter((a: any) => FavouriteItems.includes(a.name));
            setFav(fav)
            console.log(FavouriteItems)
        }
        NewFav()
    }, [tr])
    


    const [quantities, setQuantities] = useState<any>(() => {
        const initialQuantities:any = {}
        fav.forEach((q:any) => {
            initialQuantities[q.id] = 1
        })
        return initialQuantities
    })
    const [totalAmount, setTotalAmount] = useState(0)

    const plus = (itemId: any) => {
        setQuantities((prevQuantities: any) => {
            const updatedQuantity = (prevQuantities[itemId] || 1) + 1
            return {...prevQuantities,[itemId]: updatedQuantity}
        })
    }
    
    const minus = (itemId: any) => {
        setQuantities((prevQuantities: any) => {
            const updatedQuantity = Math.max((prevQuantities[itemId] || 1) - 1, 1)
            return {...prevQuantities,[itemId]: updatedQuantity}
        })
    } 

    
    useEffect(()=>{
        const calculateTotalAmount = () => {
            return fav.reduce((total:any, product:any) => {
                const quantity = quantities[product.id] || 1;
                const price = product.price || 1;
                return total + quantity * price;
              }, 0);
        };
        const newTotalAmount = calculateTotalAmount()
        setTotalAmount(newTotalAmount)
    },[fav,quantities])  
    
    return (
        <div>
            <Header favouriteProfile={favouriteProfile} count={count} currentUser={currentUser} cuUser={cuUser}/>
            <div className="body-margin">
            <div className={profile? "products-grid" : "fav-grid"}>
                {profile ?
                    (
                        products.map((product: any) =>
                            <div key={product.id} className="products">
                                <img className="product-img" src={product.imagePath} />
                                <h3 className="product-title">{product.name}</h3>
                                <div>Price:{product.price}$</div>
                                <button onClick={() => newFavourite(product.name)} className="add-cart-btn">Add to Cart</button>
                            </div>
                        )
                    ) : (
                        <div className="favourite-block">
                            <button id="back" className="count-btn" onClick={() => setProfile(true)}>Back</button>
                            {
                                fav.map((product: any) =>
                                    <div>
                                        <div className="favourite-product">
                                            <img className="favourite-product-img" src={product.imagePath} />
                                            <div className="favourite-product-p">
                                                <p>{product.price*quantities[product.id] || product.price}$</p>
                                                <p>{product.name}</p>
                                            </div>
                                            <div className="count-div">
                                            <div >
                                                <button className="count-btn" onClick={() => minus(product.id)}>-</button><span>{quantities[product.id] || 1}</span><button onClick={() => plus(product.id)} className="count-btn">+</button>

                                            </div>
                                            <button className="count-btn" onClick={() => removefavourite(product.name)}>Remove</button>
                                            </div>
                                        </div>
                                        
                                    </div>
                                )
                            }
                            <p>Total: {totalAmount}$</p>
                        </div>
                    )
                }
            </div>
            </div>
        </div>
    )
}

export default Home






























