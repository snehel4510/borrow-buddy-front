import Header from "@/components/header";
import styled from "styled-components";
import Center from "@/components/center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import Gift from "@/components/icons/Gift";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const StyledSelect = styled.select`
  /* Define your CSS styles here */
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
`;

export default function CartPage() {

  const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
  const [products,setProducts] = useState([]);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [enroll,setEnroll] = useState('');
  const [branch,setBranch] = useState('');
  const [year,setYear] = useState('');
  const [phone,setPhone] = useState('');
  const [isSuccess,setIsSuccess] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids:cartProducts})
        .then(response => {
          setProducts(response.data);
        })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  // useEffect(() => {
  //   if (typeof window === 'undefined') {
  //     return;
  //   }
  //   if (window?.location.href.includes('success')) {
  //     setIsSuccess(true);
  //     clearCart();
  //   }
  // }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    const response = await axios.post('/api/checkout', {
      name,email,year,branch,enroll,phone,
      selectedProductId,
    });
    // if (response.data.url) {
    //   window.location = response.data.url;
    // }
    if(response.data.doc) {
      setIsSuccess(true);
      clearCart();
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>Your order is sent successfully to the seller.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Your List</h2>
            {!cartProducts?.length && (
              <div>Your wishlist is empty</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    {/* <th>Select</th> */}
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={'http://localhost:3001/'+product.images[0]} alt=""/>
                        </ProductImageBox>
                        {product.title}
                        <Button red onClick={() => lessOfThisProduct(product._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M7.22 3.22A.75.75 0 017.75 3h9A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17h-9a.75.75 0 01-.53-.22L.97 10.53a.75.75 0 010-1.06l6.25-6.25zm3.06 4a.75.75 0 10-1.06 1.06L10.94 10l-1.72 1.72a.75.75 0 101.06 1.06L12 11.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L12 8.94l-1.72-1.72z" clip-rule="evenodd" /></svg>
                        </Button>
                      </ProductInfoCell>
                      {/* <td> */}
                        {/* <Button
                          onClick={() => lessOfThisProduct(product._id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product._id).length}
                        </QuantityLabel>
                        <Button
                          onClick={() => moreOfThisProduct(product._id)}>+</Button> */}
                      {/* </td> */}
                      <td>
                        {product.price !== null ? `${product.price}` 
                        : <Button green> <Gift />Givaway</Button>}
                      </td>
                    </tr>
                  ))}
                  <hr/>
                  <tr>
                    {/* <td></td> */}
                    <td>
                        <StyledSelect
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            value={selectedProductId || ''}>
                            <option value="">Select a product</option>
                            {products.map((product) => (
                                <option key={product._id} value={product._id}>
                                {product.title}
                                </option>
                            ))}
                        </StyledSelect>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        {selectedProductId ? 
                            `${products.find((product) => product._id === selectedProductId)?.price || 0}` 
                        : ''}
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Order information</h2>
              <hr />
              {selectedProductId && (
                <Box>
                    {/* <h5>Selected Product Information</h5> */}
                    {/* Display the details of the selected product */}
                    {products.map((product) =>
                    product._id === selectedProductId ? (
                        <div key={product._id}>
                        <h3>for {product.title}</h3>
                        <p>{product.price !== null ? `Price:${product.price}` 
                        : <Button green> <Gift />Givaway</Button>}</p>
                        {/* Add any other product details you want to display */}
                        </div>
                    ) : null
                    )}
                </Box>
                )}

              <Input type="text"
                     placeholder="Name"
                     value={name}
                     name="name"
                     onChange={ev => setName(ev.target.value)} />
              <Input type="text"
                     placeholder="Email"
                     value={email}
                     name="email"
                     onChange={ev => setEmail(ev.target.value)}/>
              <Input type="text"
                     placeholder="Enrollment no."
                     value={enroll}
                     name="enroll"
                     onChange={ev => setEnroll(ev.target.value)}/>
              <Input type="text"
                     placeholder="Branch"
                     value={branch}
                     name="branch"
                     onChange={ev => setBranch(ev.target.value)}/>
              <CityHolder>
                <Input type="number"
                       placeholder="Phone no."
                       value={phone}
                       name="phone"
                       onChange={ev => setPhone(ev.target.value)}/>
                <Input type="number"
                       placeholder="Year"
                       value={year}
                       name="year"
                       onChange={ev => setYear(ev.target.value)}/>
              </CityHolder>
              <Button black block
                      onClick={goToPayment}>
                Confirm order
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}