import moment from 'moment/moment';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../service/request';
import NavSeller from '../../components/NavBar/NavSeller';

function SaleOrderDetail() {
  const { id: idVenda } = useParams();
  const [orders, setOrders] = useState({ products: [] });
  const [select, setSelect] = useState();

  const { seller, totalPrice } = orders;

  async function getOrders() {
    const { token } = JSON.parse(localStorage.getItem('user'));
    const { data } = await api.get.getSaleById(idVenda, token);
    setSelect(data.status);
    setOrders({ ...data });
  }

  const updateStatus = async () => {
    const { token } = JSON.parse(localStorage.getItem('user'));
    if (select) {
      await api.put.updateStatus(token, select, idVenda);
    }
  };

  useEffect(() => updateStatus(), [select]);

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <NavSeller />
      <h2>Detalhe do Pedido</h2>
      <div>
        <div>
          <h3 data-testid="seller_order_details__element-order-details-label-order-id">
            {orders.id}
          </h3>
          <h3 data-testid="seller_order_details__element-order-details-label-seller-name">
            {`P. Vend: ${seller && seller.name}`}
          </h3>
          <h3
            data-testid={
              'seller_order_details__'
              + 'element-order-details-label-order-date'
            }
          >
            {moment(orders.saleDate).format('DD/MM/YYYY')}
          </h3>

          <div>
            <p
              data-testid={
                'seller_order_details__element-order'
                + '-details-label-delivery-status'
              }
            >
              {select && (select || 'Pendente')}
            </p>
          </div>

          <button
            type="button"
            data-testid="seller_order_details__button-preparing-check"
            disabled={ select !== 'Pendente' }
            onClick={ () => setSelect('Preparando') }
          >
            Preparar pedido
          </button>

          <button
            type="button"
            data-testid="seller_order_details__button-dispatch-check"
            disabled={ select !== 'Preparando' }
            onClick={ () => setSelect('Em Trânsito') }
          >
            Saiu para entrega
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Sub-total</th>
          </tr>
        </thead>
        <tbody>
          {orders.products.map((product, index = 1) => (
            <tr key={ index }>
              <td
                data-testid={
                  `seller_order_details__element-order-table-item-number-${index}`
                }
              >
                {index + 1}
              </td>
              <td
                data-testid={ `seller_order_details__element-order-table-name-${index}` }
              >
                {product.name}
              </td>
              <td
                data-testid={
                  `seller_order_details__element-order-table-quantity-${index}`
                }
              >
                {product.SalesProducts.quantity}
              </td>
              <td
                data-testid={
                  `seller_order_details__element-order-table-unit-price-${index}`
                }
              >
                {product.price}
              </td>
              <td
                data-testid={
                  `seller_order_details__element-order-table-sub-total-${index}`
                }
              >
                {(
                  parseFloat(product.price) * product.SalesProducts.quantity
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>Total: R$</p>
        <p data-testid="seller_order_details__element-order-total-price">
          {totalPrice && totalPrice.replace('.', ',')}
        </p>
      </div>
    </>
  );
}

export default SaleOrderDetail;