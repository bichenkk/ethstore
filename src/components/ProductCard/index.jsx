import React from 'react'
import { Card, Button, Row, Col, Tag } from 'antd'
import _ from 'lodash'
import logoEthereum from '../../assets/logo-ethereum-white.png'
import './index.less'

class ProductCard extends React.Component {
  constructor(props) {
    super(props)
    this.handlePurchaseButtonOnClick = this.handlePurchaseButtonOnClick.bind(this)
  }

  handlePurchaseButtonOnClick() {
    const { product, onPurchase } = this.props
    onPurchase(product)
  }

  render() {
    const { product } = this.props
    const {
      price,
      count,
      enabled,
      name,
      description,
      imageUrl,
      store,
    } = product

    const notAvailable = (count === '0' || !enabled)
    return (
      <Card hoverable className='product-card'>
        <div className='information'>
          <img src={imageUrl} alt={name} />
          <div className='title'><b>{name}</b></div>
          {
            store && (
              <div className='merchant'>
                {store.name}
              </div>)
          }
          <div className='stock'>{count === '0' ? <Tag color='red'>Sold Out</Tag> : `${count} Left`}</div>
          <div className='description'>
            {
              _.truncate(description, {
                length: 70,
                omission: '...',
              })
            }
          </div>
        </div>
        <div className='panel'>
          <Row className='purchase'>
            <Col span={12}>
              <div className='price-information'>
                <img src={logoEthereum} alt='ether' />
                <div className='price'>{window.web3.fromWei(price, 'ether')}</div>
                <div className='unit'>ETH</div>
              </div>
            </Col>
            <Col span={12}>
              <Button
                block
                disabled={notAvailable}
                type='primary'
                icon={notAvailable ? null : 'shopping-cart'}
                onClick={this.handlePurchaseButtonOnClick}
              >
                {notAvailable ? 'Not Available' : 'Purchase'}
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    )
  }
}

export default ProductCard
