import React from 'react'
import { Row, Table, Breadcrumb, message, Button } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import BooleanStatus from '../../components/BooleanStatus'
import ImagePreview from '../../components/ImagePreview'
import getContractMethodValue from '../../utils/getContractMethodValue'
import PermissionContainer from '../../components/PermissionContainer'

class AdminStoreList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.storeCountDataKey = this.EthStore.methods.storeCount.cacheCall()
      this.handleItemButtonOnClick = this.handleItemButtonOnClick.bind(this)
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

  async handleItemButtonOnClick(storeId, enabled) {
    try {
      await this.EthStore.methods.enableStore(storeId, enabled).send({
        gasLimit: '500000',
      })
      message.success('You have made the change successfully.')
    } catch (error) {
      message.error(error.message)
    }
  }

  render() {
    const { EthStore } = this.props
    const stores = (this.storeDataKeys && this.storeDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'stores', dataKey))
      .filter(store => store && Object.keys(store).length > 0)
    ) || []
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: value => value || 'N/A',
      }, {
        title: 'Owner',
        dataIndex: 'storeOwner',
        key: 'storeOwner',
        render: value => `${value.substring(0, 7)}...`,
      }, {
        title: 'Product Number',
        dataIndex: 'productCount',
        key: 'productCount',
      }, {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: value => <ImagePreview src={value} />,
      }, {
        title: 'Enabled',
        dataIndex: 'enabled',
        key: 'enabled',
        render: value => <BooleanStatus value={value} />,
      }, {
        dataIndex: 'action',
        key: 'action',
        render: (value, record) => (
          <Button onClick={() => this.handleItemButtonOnClick(record.id, !record.enabled)}>
            {record.enabled ? 'Disable' : 'Enable'}
          </Button>
        ),
      },
    ]
    return (
      <AppLayout>
        <PermissionContainer permission='administrator'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Admin Portal</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Stores</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={24} style={{ marginTop: '24px' }}>
            <Table
              rowKey={record => `item-row-${record.id}`}
              columns={columns}
              dataSource={stores}
            />
          </Row>
        </PermissionContainer>
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
