import React from 'react'
import { Row, Col } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import ProductCard from '../../components/ProductCard'
import './index.less'

class Home extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.contracts = context.drizzle.contracts
    this.handleProductCardOnPurchase = this.handleProductCardOnPurchase.bind(this)
  }

  componentWillReceiveProps(nextProps) {
  }

  async handleProductCardOnPurchase(product) {
    const { EthStore } = this.contracts
    const productId = product[0]
    const productPrice = product[2]
    const transaction = await EthStore.methods.purchaseProduct(productId).send({
      value: productPrice,
    })
    console.log('transaction', transaction)
  }

  render() {
    const { contracts } = this
    const {
      web3,
      accounts,
      drizzleStatus,
      EthStore,
    } = this.props
    const isReady = web3.status === 'initialized' && Object.keys(accounts).length > 0 && drizzleStatus.initialized
    if (!isReady) {
      return (<AppLayout />)
    }
    const getIdentityDataKey = contracts.EthStore.methods.getIdentity.cacheCall()
    const getIdentity = (getIdentityDataKey && _.get(EthStore, `getIdentity.${getIdentityDataKey}.value`)) || {}
    const storeCountDataKey = contracts.EthStore.methods.storeCount.cacheCall()
    const storeCount = (getIdentityDataKey && _.get(EthStore, `storeCount.${storeCountDataKey}.value`)) || 0
    const productCountDataKey = contracts.EthStore.methods.productCount.cacheCall()
    const productCount = (getIdentityDataKey && _.get(EthStore, `productCount.${productCountDataKey}.value`)) || 0
    const products = (productCount > 0 && _.range(productCount)
      .map((item, index) => {
        const productDataKey = contracts.EthStore.methods.products.cacheCall(index)
        const product = (productDataKey && _.get(EthStore, `products.${productDataKey}.value`)) || {}
        return product
      })
      .filter(product => Object.keys(product).length > 0)) || []
    return (
      <AppLayout>
        <Row gutter={24}>
          {products.map(product => (
            <Col style={{ marginBottom: '24px' }} span={8} key={`col-productcard-${product[0]}`}>
              <ProductCard product={product} onPurchase={this.handleProductCardOnPurchase} />
            </Col>
          ))}
        </Row>
      </AppLayout>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
    isEditItemLoading,
    isEditItemSuccess,
    editItemTransaction,
    editItemError,
  } = state.home
  return {
    formFieldValues,
    isEditItemLoading,
    isEditItemSuccess,
    editItemTransaction,
    editItemError,
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = dispatch => ({
})

export default drizzleConnect(Home, mapStateToProps, mapDispatchToProps)
