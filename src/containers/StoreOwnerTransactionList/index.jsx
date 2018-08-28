import React from 'react'
import { Row, Table, Breadcrumb } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import PermissionContainer from '../../components/PermissionContainer'
import StoreCard from '../../components/StoreCard'
import getContractMethodValue from '../../utils/getContractMethodValue'

class StoreOwnerTransactionList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
      this.storeOwnerToStoreIdDataKey = this.EthStore
        .methods.storeOwnerToStoreId.cacheCall(this.props.accounts[0])
      this.transactionCountDataKey = this.EthStore.methods.transactionCount.cacheCall()
      const currentTransactionCount = getContractMethodValue(this.props.EthStore, 'transactionCount', this.transactionCountDataKey) || 0
      this.transactionDataKeys = (currentTransactionCount > 0 && _.range(currentTransactionCount)
        .map((item, index) => this.EthStore.methods.transactions.cacheCall(index)))
      const storeId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey)
      this.storeDataKey = storeId && this.EthStore.methods.stores.cacheCall(storeId - 1)
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentTransactionCount = getContractMethodValue(this.props.EthStore, 'transactionCount', this.transactionCountDataKey) || 0
    const nextTransactionCount = getContractMethodValue(nextProps.EthStore, 'transactionCount', this.transactionCountDataKey) || 0
    if (currentTransactionCount !== nextTransactionCount) {
      this.transactionDataKeys = (nextTransactionCount > 0 && _.range(nextTransactionCount)
        .map((item, index) => this.EthStore.methods.transactions.cacheCall(index)))
    }
    const currentStoreId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey) || 0
    const nextStoreId = getContractMethodValue(nextProps.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey) || 0
    if (currentStoreId !== nextStoreId) {
      this.storeDataKey = nextStoreId && this.EthStore.methods.stores.cacheCall(nextStoreId - 1)
    }
  }

  render() {
    const { EthStore } = this.props
    const transactions = (this.transactionDataKeys && this.transactionDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'transactions', dataKey))
      .filter(transaction => transaction
        && Object.keys(transaction).length > 0)
    ) || []
    const storeId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey)
    const transactionsWithStore = transactions
      .filter(item => item.storeId && item.storeId === storeId)
    const store = this.storeDataKey && storeId && getContractMethodValue(EthStore, 'stores', this.storeDataKey)
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
      }, {
        title: 'Product ID',
        dataIndex: 'productId',
        key: 'productId',
      }, {
        title: 'Buyer',
        dataIndex: 'buyer',
        key: 'buyer',
      }, {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: value => `${window.web3.fromWei(value, 'ether')} ETH`,
      },
    ]
    return (
      <AppLayout>
        <PermissionContainer permission='storeOwner'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Store Owner Portal</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Transactions</Breadcrumb.Item>
          </Breadcrumb>
          {
            store && <StoreCard store={store} />
          }
          <Row gutter={24} style={{ marginTop: '24px' }}>
            <Table
              rowKey={record => `item-row-${record.id}`}
              columns={columns}
              dataSource={transactionsWithStore}
            />
          </Row>
        </PermissionContainer>
      </AppLayout>
    )
  }
}

StoreOwnerTransactionList.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  EthStore: state.contracts.EthStore,
})

const mapDispatchToProps = () => ({})

export default drizzleConnect(StoreOwnerTransactionList, mapStateToProps, mapDispatchToProps)
