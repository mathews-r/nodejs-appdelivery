import PropTypes, { string, number } from 'prop-types';
import { useState, useEffect } from 'react';

export default function ProductCard({ id, name, image, price, handleCard, setIsActive }) {
  const [quantity, setQuantity] = useState(0);

  const updateLocalStorage = (newQuantity) => {
    const arrCart = JSON.parse(localStorage.getItem('carrinho'));
    const arrCartPrepared = arrCart.filter((item) => item.id !== id);
    const newItem = {
      id,
      name,
      quantity: newQuantity,
      unitPrice: price,
      subTotal: parseFloat(price.replace(',', '.')) * newQuantity,
    };
    localStorage.setItem('carrinho', JSON.stringify([...arrCartPrepared, newItem]));
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateLocalStorage(newQuantity);
    setIsActive(false);
    handleCard(JSON.parse(localStorage.getItem('carrinho')));
  };

  const decreaseQuantity = () => {
    const newQuantity = quantity - 1;
    if (newQuantity < 0) return setQuantity(0);
    setQuantity(newQuantity);
    updateLocalStorage(newQuantity);

    handleCard(JSON.parse(localStorage.getItem('carrinho')));
  };

  const inputQuantity = ({ value }) => {
    if (value < 0) return setQuantity(0);
    setQuantity(value);
    updateLocalStorage(value);

    handleCard(JSON.parse(localStorage.getItem('carrinho')));
  };

  useEffect(() => { localStorage.setItem('carrinho', JSON.stringify([])); }, []);

  return (
    <section className="section col">
      <div className="card">
        <img
          className="card-img-top"
          style={ { width: '8rem' } }
          data-testid={ `customer_products__img-card-bg-image-${id}` }
          src={ image }
          alt=""
        />
        <p
          className="card-text"
          data-testid={ `customer_products__element-card-title-${id}` }
        >
          {name}
        </p>

      </div>

      <p
        className="card-text"
        data-testid={ `customer_products__element-card-price-${id}` }
      >
        {`R$ ${price}`}
      </p>

      <div className="input-group mb-3">
        <button
          className="btn btn-outline-secondary"
          type="button"
          data-testid={ `customer_products__button-card-rm-item-${id}` }
          title="remove"
          onClick={ () => decreaseQuantity() }
        >
          -
        </button>
        <input
          className="form-control2"
          type="text"
          data-testid={ `customer_products__input-card-quantity-${id}` }
          value={ quantity }
          title="inputQuantity"
          onChange={ (e) => inputQuantity(e.target) }
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          data-testid={ `customer_products__button-card-add-item-${id}` }
          title="add"
          onClick={ () => increaseQuantity() }
        >
          +
        </button>
      </div>
    </section>
  );
}

ProductCard.propTypes = {
  id: number.isRequired,
  name: string.isRequired,
  image: string.isRequired,
  price: string.isRequired,
  handleCard: PropTypes.func.isRequired,
  setIsActive: PropTypes.func.isRequired,
};
