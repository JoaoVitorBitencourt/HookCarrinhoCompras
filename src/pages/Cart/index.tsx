import React, { useEffect, useState } from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface ProductFormmated extends Product {
  priceFormatted: string;
  subTotal: string;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted: ProductFormmated[] = cart.map(el => {
    return {
      ...el,
      priceFormatted: formatPrice(el.price),
      subTotal: formatPrice(el.price * el.amount)
    }
  });

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal += product.price * product.amount;
      }, 0)
    );

  function handleProductIncrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount + 1 });
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount - 1 });
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {
            cartFormatted.map(el => (
              <tr data-testid="product" key={el.id}>
                <td>
                  <img src={el.image} alt={el.title} />
                </td>
                <td>
                  <strong>{el.title}</strong>
                  <span>{el.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={el.amount <= 1}
                      onClick={() => handleProductDecrement(el)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={el.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(el)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{el.subTotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(el.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
