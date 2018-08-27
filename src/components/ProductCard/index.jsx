import React from 'react'
import { Card, Button, Row, Col } from 'antd'
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
      0: id,
      1: storeId,
      2: price,
      3: count,
      4: enabled,
      5: name,
      6: description,
      7: imageUrl,
    } = product
    
    const notAvailable = (count === '0' || !enabled)
    return (
      <Card className='product-card'>
        <div>
          <img src={imageUrl} alt={name} />
          <div className='title'><b>{name}</b></div>
          <div className='description'>
            {
              _.truncate(description, {
                length: 70,
                omission: '...',
              })
            }
          </div>
          <div className='stock'>{count === '0' ? 'No Stock' : `${count} Left`}</div>
        </div>
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
              icon='shopping-cart'
              onClick={this.handlePurchaseButtonOnClick}
            >
              {notAvailable ? 'Not Available' : 'Purchase'}
            </Button>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default ProductCard
