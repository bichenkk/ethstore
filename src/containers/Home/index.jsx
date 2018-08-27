import React from 'react'
import { Row, Col, message } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
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
        gasLimit: '100000',
      })
    } catch (error) {
      message.error(error.message)
    }
  }

  render() {
    const { EthStore } = this.props
    const products = (this.productDataKeys && this.productDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'products', dataKey))
      .filter(product => product && Object.keys(product).length > 0 && product[4])
    ) || []
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
