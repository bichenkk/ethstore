import React from 'react'
import { Row, Table, Breadcrumb } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import BooleanStatus from '../../components/BooleanStatus'
import getContractMethodValue from '../../utils/getContractMethodValue'

class AdminStoreList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    this.storeCountDataKey = this.EthStore.methods.storeCount.cacheCall()
    const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
    this.storeDataKeys = (currentStoreCount > 0 && _.range(currentStoreCount)
      .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
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
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
      }, {
        title: 'Store Owner',
        dataIndex: 'storeOwner',
        key: 'storeOwner',
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'imageUrl',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
      }, {
        title: 'productCount',
        dataIndex: 'productCount',
        key: 'productCount',
      },
    ]
    return (
      <AppLayout>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
          <Breadcrumb.Item>Admin Portal</Breadcrumb.Item>
          <Breadcrumb.Item>Manage Products</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={24} style={{ marginTop: '24px' }}>
          <Table
            rowKey={record => `item-row-${record.id}`}
            columns={columns}
            dataSource={stores}
          />
        </Row>
      </AppLayout>
    )
  }
}

AdminStoreList.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => (
  {
    accounts: state.accounts,
    EthStore: state.contracts.EthStore,
  }
)

const mapDispatchToProps = () => ({})

export default drizzleConnect(AdminStoreList, mapStateToProps, mapDispatchToProps)
