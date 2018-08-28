import React from 'react'
import { Row, Col, Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import StoreCard from '../../components/StoreCard'
import getContractMethodValue from '../../utils/getContractMethodValue'

class StoreList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.storeCountDataKey = this.EthStore.methods.storeCount.cacheCall()
      const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
      this.storeDataKeys = (currentStoreCount > 0 && _.range(currentStoreCount)
        .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
    const nextStoreCount = getContractMethodValue(nextProps.EthStore, 'storeCount', this.storeCountDataKey) || 0
    if (currentStoreCount !== nextStoreCount) {
      this.storeDataKeys = (nextStoreCount > 0 && _.range(nextStoreCount)
        .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
    }
  }

  render() {
    const { EthStore } = this.props
    const stores = (this.storeDataKeys && this.storeDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'stores', dataKey))
      .filter(store => store && Object.keys(store).length > 0 && store.enabled)
    ) || []
    return (
      <AppLayout>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
          <Breadcrumb.Item>Stores</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={24} style={{ marginTop: '24px' }}>
          {stores.map(store => (
            <Col style={{ marginBottom: '24px' }} span={24} key={`col-storecard-${store[0]}`}>
              <Link to={`/store_list/${store.id}`}>
                <StoreCard store={store} />
              </Link>
            </Col>
          ))}
        </Row>
      </AppLayout>
    )
  }
}

StoreList.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => (
  {
    accounts: state.accounts,
    EthStore: state.contracts.EthStore,
  }
)

const mapDispatchToProps = () => ({})

export default drizzleConnect(StoreList, mapStateToProps, mapDispatchToProps)
