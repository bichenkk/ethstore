import React from 'react'
import { Row, Table, message, Breadcrumb, Button } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import BooleanStatus from '../../components/BooleanStatus'
import ImagePreview from '../../components/ImagePreview'
import getContractMethodValue from '../../utils/getContractMethodValue'
import PermissionContainer from '../../components/PermissionContainer'

class AdminTransactionList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
      this.storeCountDataKey = this.EthStore.methods.storeCount.cacheCall()
      this.transactionCountDataKey = this.EthStore.methods.transactionCount.cacheCall()
      this.handleItemButtonOnClick = this.handleItemButtonOnClick.bind(this)
      const currentTransactionCount = getContractMethodValue(this.props.EthStore, 'transactionCount', this.transactionCountDataKey) || 0
      this.transactionDataKeys = (currentTransactionCount > 0 && _.range(currentTransactionCount)
        .map((item, index) => this.EthStore.methods.transactions.cacheCall(index)))
      const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
      this.storeDataKeys = (currentStoreCount > 0 && _.range(currentStoreCount)
        .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentTransactionCount = getContractMethodValue(this.props.EthStore, 'transactionCount', this.transactionCountDataKey) || 0
    const nextTransactionCount = getContractMethodValue(nextProps.EthStore, 'transactionCount', this.transactionCountDataKey) || 0
    if (currentTransactionCount !== nextTransactionCount) {
      this.transactionDataKeys = (nextTransactionCount > 0 && _.range(nextTransactionCount)
        .map((item, index) => this.EthStore.methods.transactions.cacheCall(index)))
    }
    const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
    const nextStoreCount = getContractMethodValue(nextProps.EthStore, 'storeCount', this.storeCountDataKey) || 0
    if (currentStoreCount !== nextStoreCount) {
      this.storeDataKeys = (nextStoreCount > 0 && _.range(nextStoreCount)
        .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
    }
  }

  async handleItemButtonOnClick(transactionId, enabled) {
    try {
      await this.EthStore.methods.enableTransaction(transactionId, enabled).send({
        gasLimit: '500000',
      })
      message.success('You have made the change successfully.')
    } catch (error) {
      message.error(error.message)
    }
  }

  render() {
    const { EthStore } = this.props
    const transactions = (this.transactionDataKeys && this.transactionDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'transactions', dataKey))
      .filter(transaction => transaction && Object.keys(transaction).length > 0)
    ) || []
    const stores = (this.storeDataKeys && this.storeDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'stores', dataKey))
      .filter(store => store && Object.keys(store).length > 0)
    ) || []
    const storeMap = stores.reduce((prev, item) => {
      const id = item[0]
      return {
        ...prev,
        [id]: Object.assign(item),
      }
    }, {})
    const transactionsWithStore = transactions.map((item) => {
      const store = storeMap[item.storeId]
      return { ...item, store }
    })
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
      }, {
        title: 'Store ID',
        dataIndex: 'storeId',
        key: 'storeId',
      }, {
        title: 'Transaction ID',
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
        <PermissionContainer permission='administrator'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Admin Portal</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Transactions</Breadcrumb.Item>
          </Breadcrumb>
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

AdminTransactionList.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = () => ({})

export default drizzleConnect(AdminTransactionList, mapStateToProps, mapDispatchToProps)
