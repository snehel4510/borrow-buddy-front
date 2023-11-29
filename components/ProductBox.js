import styled from "styled-components";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import {useContext, useState} from "react";
import {CartContext} from "@/components/CartContext";
import Gift from "./icons/Gift";
import axios from "axios";


const ProductWrapper = styled.div`
  
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title = styled(Link)`
  display: flex;
  align-items: center;
  font-weight:500;
  text-align:center;
  font-size:1.2rem;
  color:inherit;
  text-decoration:none;
  margin:0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 200;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight:600;
    text-align: left;
  }
`;

export default function ProductBox({_id,title,price,images,inWishlist}) {

  const {addProduct,removeProduct} = useContext(CartContext);
  const [isInWishlist, setIsInWishlist] = useState(null);

  const handleToggleWishlist = async (id) => {
  try {
    console.log(title,inWishlist)
    const action = isInWishlist ? 'remove' : 'add';
    if (action === 'add') {
      addProduct(id);
    } else {
      removeProduct(id);
    }
    // await axios.post('/api/wishlist', { productId: id, action });
    setIsInWishlist(!isInWishlist);
  } catch (error) {
    console.error(error);
  }
};


  const url = '/product/'+_id;

  const buttonProps = isInWishlist
    ? {
        primary: true,
        outline: false,
        children: (
          <> <CartIcon /> Remove </>
        ),
      }
    : {
        block: true,
        primary: true,
        outline: true,
        children: (
          <>
            <CartIcon /> Add </>
        ),
      };



  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={'http://localhost:3001/'+images?.[0]} alt="no image"/>
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>
          {title}
          <PriceRow>
            {price !== null ? <Price>| Rs.{price}</Price>
            : <Button green> <Gift />Giveaway</Button>}
          </PriceRow>
        </Title>
        <Button {...buttonProps} onClick={() => handleToggleWishlist(_id)}/>
      </ProductInfoBox>
    </ProductWrapper>
  );
}