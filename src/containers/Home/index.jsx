import React from 'react'
import { Row, Col, message, Breadcrumb } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import IntroductionCard from '../../components/IntroductionCard'
import ProductCard from '../../components/ProductCard'
import getContractMethodValue from '../../utils/getContractMethodValue'
import './index.less'

class Home extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
    this.storeCountDataKey = this.EthStore.methods.storeCount.cacheCall()
    this.productCountDataKey = this.EthStore.methods.productCount.cacheCall()
    this.handleProductCardOnPurchase = this.handleProductCardOnPurchase.bind(this)
    const currentProductCount = getContractMethodValue(this.props.EthStore, 'productCount', this.productCountDataKey) || 0
    this.productDataKeys = (currentProductCount > 0 && _.range(currentProductCount)
      .map((item, index) => this.EthStore.methods.products.cacheCall(index)))
    const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
    this.storeDataKeys = (currentStoreCount > 0 && _.range(currentStoreCount)
      .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
  }

  componentWillReceiveProps(nextProps) {
    const currentProductCount = getContractMethodValue(this.props.EthStore, 'productCount', this.productCountDataKey) || 0
    const nextProductCount = getContractMethodValue(nextProps.EthStore, 'productCount', this.productCountDataKey) || 0
    if (currentProductCount !== nextProductCount) {
      this.productDataKeys = (nextProductCount > 0 && _.range(nextProductCount)
        .map((item, index) => this.EthStore.methods.products.cacheCall(index)))
    }
    const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
    const nextStoreCount = getContractMethodValue(nextProps.EthStore, 'storeCount', this.storeCountDataKey) || 0
    if (currentStoreCount !== nextStoreCount) {
      this.storeDataKeys = (nextStoreCount > 0 && _.range(nextStoreCount)
        .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
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
    const products = (this.productDataKeys && this.productDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'products', dataKey))
      .filter(product => product && Object.keys(product).length > 0 && product.enabled)
    ) || []
    const stores = (this.storeDataKeys && this.storeDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'stores', dataKey))
      .filter(store => store && Object.keys(store).length > 0 && store.enabled)
    ) || []
    const storeMap = stores.reduce((prev, item) => {
      const id = item[0]
      return {
        ...prev,
        [id]: Object.assign(item),
      }
    }, {})
    const productsWithStore = products.map((item) => {
      const store = storeMap[item.storeId]
      return { ...item, store }
    })
    return (
      <AppLayout>
        <div>
          <IntroductionCard />
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={24} style={{ marginTop: '24px' }}>
            {productsWithStore.map(product => (
              <Col style={{ marginBottom: '24px' }} span={8} key={`col-productcard-${product[0]}`}>
                <ProductCard product={product} onPurchase={this.handleProductCardOnPurchase} />
              </Col>
            ))}
          </Row>
        </div>
      </AppLayout>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = () => ({})

export default drizzleConnect(Home, mapStateToProps, mapDispatchToProps)
