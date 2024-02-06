import { useState, useEffect } from "react"
import Header from "./Header"
import axios from 'axios';

interface HomeProps {
    currentUser: any;
    isAdmin: any;
    setIsAdmin: React.Dispatch<React.SetStateAction<any>>
}


const Home: React.FC<HomeProps> = ({ currentUser, isAdmin, setIsAdmin }) => {
    const [profile, setProfile] = useState<boolean>(true)
    const [products, setProducts] = useState([])
    const [toFindQuantity, setToFindQuantity] = useState<any>([])
    const [fav, setFav] = useState<any>([])
    // const [increaseQuantity,setIncreaseQuantity]=useState<any>(1)
    // const [quantities, setQuantities] = useState<any>([])
    const [arry, setArry] = useState<any[]>([])
    const [count, setCount] = useState<number>(0)
    const [cuUser, setCuUser] = useState(sessionStorage.getItem('currentUser'))


    const [tr, setTr] = useState(true)
    const [tr1, setTr1] = useState(true)
    // const [tr2,setTr2]=useState(true)

    useEffect(() => {
        const set = new Set(fav)
        setCount(set.size)
    }, [fav])
    useEffect(() => {
        const fun = async () => {
            const response = await axios.get('http://localhost:5000/api/shopping', {
                withCredentials: true
            });
            const products = await response.data

            const sortedProducts = products.products
            const sortedProduct = sortedProducts.sort((a: any, b: any) => a.id - b.id);

            setProducts(sortedProduct)
            // setTr(!tr)
        }
        fun()
    }, [tr1, profile])

    const favouriteProfile = () => {
        setProfile(false)
        console.log(`hi i am ${cuUser}`)
    }

    const newFavourite = async (e: any) => {
        // const response = await fetch('http://localhost:5000/api/shopping/username/favourites', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     credentials: 'include',
        //     body: JSON.stringify({ user: cuUser, productName:e }),

        // })

        const response = await axios('http://localhost:5000/api/shopping/username/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: { user: cuUser, productName: e },

        })
        setTr(!tr)
        setTr1(!tr1)
    }
    const removefavourite = async (e: any) => {
        const response = await fetch(`http://localhost:5000/api/shopping/username/favourites?param1=${cuUser}&param2=${e}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ user: cuUser, productName: e }),
            credentials: 'include'
        })
        const newArry = await response.json()
        setTr(!tr)
        // setTr1(!tr1)
    }


    const minus = async (productName: any) => {
        try{
        const response = await fetch(`http://localhost:5000/api/shopping/username/favourites`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: cuUser, productName: productName, calc: "minus" }),
            credentials: 'include',
        })

        const req: any = await response.json();
            const userObj = req.message;
            console.log(userObj)
    }catch(e){
        console.log(e)
    }




    // try{
    //     const response = await axios(`http://localhost:5000/api/shopping/username/favourites`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         data: JSON.stringify({ user: cuUser, productName: productName, calc: "minus" }),
    //         withCredentials:true
    //     })
    // }catch(e){
    //     console.log(e)
    // }
        setTr(!tr)
    }

    const plus = async (productName: any) => {
        try {
            const response = await fetch(`http://localhost:5000/api/shopping/username/favourites`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: cuUser, productName: productName, calc: "plus" }),
                credentials: 'include'
            })
            const req: any = await response.json();
            const userObj = req.message;
            if (userObj == "Invalid calc value") {
                alert("stack not available")
            }
        } catch (e) {
            console.log(e)
        }
        setTr(!tr)

    }
    useEffect(() => {
        const NewFav = async () => {
            // const response2 = await fetch('http://localhost:5000/api/shopping/username/favourites')

            const response2 = await axios('http://localhost:5000/api/shopping/username/favourites', {
                withCredentials: true,
            })

            const getFavourites = await response2.data
            const required = await getFavourites.favourieArry
            setToFindQuantity(required)
            const ar = await required.filter((a: any) => a.user == cuUser)
            const an = await ar.map((a: any) => a.productName)
            const filteredProducts = products.filter((product: any) => an.includes(product.name));
            setFav(filteredProducts)
            console.log(fav)
            // setTr1(!tr1)
        }
        NewFav()
    }, [tr, profile, products])

    const [totalAmount, setTotalAmount] = useState(0)

    const calcuateTotalAmount = fav.reduce((acc: any, product: any) => {
        const requiredQuantity = toFindQuantity.filter((a: any) => a.productName == product.name)[0].quantity
        const individualTotal = product.price * requiredQuantity
        return acc + individualTotal
    }, 0)
    useEffect(() => {
        setTotalAmount(calcuateTotalAmount)
        console.log(calcuateTotalAmount)
    }, [calcuateTotalAmount])




    return (
        <div>
            <Header favouriteProfile={favouriteProfile} count={count} currentUser={currentUser} cuUser={cuUser} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            <div className="body-margin">
                <div className={profile ? "products-grid" : "fav-grid"}>
                    {profile ?
                        (
                            products.map((product: any) =>
                                <div key={product.id} className="products">
                                    <img className="product-img" src={product.imagePath} />
                                    <h3 className="product-title">{product.name}</h3>
                                    <div>Price:{product.price}$</div>
                                    <p>Available:{product.quantity}</p>
                                    {!isAdmin ? (product.quantity >= 1 ?
                                        (<button onClick={() => newFavourite(product.name)} className="add-cart-btn">Add to Cart</button>) : <button className="add-cart-btn1">No stacks available</button>
                                    ) : null}
                                </div>
                            )
                        ) : (
                            <div className="favourite-block">
                                <button id="back" className="count-btn" onClick={() => setProfile(true)}>Back</button>
                                {
                                    fav.map((product: any) => {

                                        return (<div>
                                            <div key={product.id} className="favourite-product">
                                                <img className="favourite-product-img" src={product.imagePath} />
                                                <div className="favourite-product-p">
                                                    <p>{product.price * toFindQuantity.filter((a: any) => a.productName == product.name)[0].quantity}$</p>
                                                    <p>{product.name}</p>
                                                </div>
                                                <div className="count-div">
                                                    <div>
                                                        <button className="count-btn" onClick={() => minus(product.name)}>-</button><span>{toFindQuantity.filter((a: any) => a.productName == product.name)[0].quantity}</span><button onClick={() => plus(product.name)} className="count-btn">+</button>

                                                    </div>
                                                    <button className="count-btn" onClick={() => removefavourite(product.name)}>Remove</button>
                                                </div>
                                            </div>

                                        </div>
                                        )
                                    })
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


















































