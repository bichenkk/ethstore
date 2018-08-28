import React from 'react'
import { Row, Col, Breadcrumb, message } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import StoreCard from '../../components/StoreCard'
import ProductCard from '../../components/ProductCard'
import getContractMethodValue from '../../utils/getContractMethodValue'

class StoreOwnerProductList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    this.handleProductCardOnPurchase = this.handleProductCardOnPurchase.bind(this)
    if (this.EthStore) {
      const { storeId } = this.props.match.params
      this.storeDataKey = storeId && this.EthStore.methods.stores.cacheCall(storeId - 1)
      this.productCountDataKey = this.EthStore.methods.productCount.cacheCall()
      const currentProductCount = getContractMethodValue(this.props.EthStore, 'productCount', this.productCountDataKey) || 0
      this.productDataKeys = (currentProductCount > 0 && _.range(currentProductCount)
        .map((item, index) => this.EthStore.methods.products.cacheCall(index)))
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentProductCount = getContractMethodValue(this.props.EthStore, 'productCount', this.productCountDataKey) || 0
    const nextProductCount = getContractMethodValue(nextProps.EthStore, 'productCount', this.productCountDataKey) || 0
    if (currentProductCount !== nextProductCount) {
      this.productDataKeys = (nextProductCount > 0 && _.range(nextProductCount)
        .map((item, index) => this.EthStore.methods.products.cacheCall(index)))
    }
  }
  async handleProductCardOnPurchase(product) {
    const productId = product[0]
    const productPrice = product[2]
    try {
      await this.EthStore.methods.purchaseProduct(productId).send({
        value: productPrice,
        gasLimit: '500000',
      })
      message.success('You have made the purchase successfully.')
    } catch (error) {
      message.error(error.message)
    }
  }

  render() {
    const { EthStore } = this.props
    const { storeId } = this.props.match.params
    const store = this.storeDataKey && storeId && getContractMethodValue(EthStore, 'stores', this.storeDataKey)
    const products = (this.productDataKeys && this.productDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'products', dataKey))
      .filter(product => product
        && Object.keys(product).length > 0
        && product.enabled)
    ) || []
    const productsWithStore = products
      .filter(item => item.storeId && item.storeId === storeId)
    return (
      <AppLayout>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
          <Breadcrumb.Item><a href='/store_list'>Stores</a></Breadcrumb.Item>
          <Breadcrumb.Item>Store Detail</Breadcrumb.Item>
        </Breadcrumb>
        {
          store && <StoreCard store={store} />
        }
        <Row gutter={24} style={{ marginTop: '24px' }}>
          {productsWithStore.map(product => (
            <Col style={{ marginBottom: '24px' }} span={8} key={`col-productcard-${product[0]}`}>
              <ProductCard product={product} onPurchase={this.handleProductCardOnPurchase} />
            </Col>
          ))}
        </Row>
      </AppLayout>
    )
  }
}

StoreOwnerProductList.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  EthStore: state.contracts.EthStore,
})

const mapDispatchToProps = () => ({})

export default drizzleConnect(StoreOwnerProductList, mapStateToProps, mapDispatchToProps)
