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

class AdminProductList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
      this.storeCountDataKey = this.EthStore.methods.storeCount.cacheCall()
      this.productCountDataKey = this.EthStore.methods.productCount.cacheCall()
      this.handleItemButtonOnClick = this.handleItemButtonOnClick.bind(this)
      const currentProductCount = getContractMethodValue(this.props.EthStore, 'productCount', this.productCountDataKey) || 0
      this.productDataKeys = (currentProductCount > 0 && _.range(currentProductCount)
        .map((item, index) => this.EthStore.methods.products.cacheCall(index)))
      const currentStoreCount = getContractMethodValue(this.props.EthStore, 'storeCount', this.storeCountDataKey) || 0
      this.storeDataKeys = (currentStoreCount > 0 && _.range(currentStoreCount)
        .map((item, index) => this.EthStore.methods.stores.cacheCall(index)))
    }
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

  async handleItemButtonOnClick(productId, enabled) {
    try {
      await this.EthStore.methods.enableProduct(productId, enabled).send({
        gasLimit: '500000',
      })
      message.success('You have made the change successfully.')
    } catch (error) {
      message.error(error.message)
    }
  }

  render() {
    const { EthStore } = this.props
    const products = (this.productDataKeys && this.productDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'products', dataKey))
      .filter(product => product && Object.keys(product).length > 0)
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
    const productsWithStore = products.map((item) => {
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
        title: 'Store',
        dataIndex: 'store',
        key: 'store',
        render: value => `${(value && value.name) || 'N/A'}`,
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: value => `${window.web3.fromWei(value, 'ether')} ETH`,
      }, {
        title: 'Inventory',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: 'Enabled',
        dataIndex: 'enabled',
        key: 'enabled',
        render: value => <BooleanStatus value={value} />,
      }, {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: value => <ImagePreview src={value} />,
      }, {
        dataIndex: 'action',
        key: 'action',
        render: (value, record) => (
          <Button onClick={() => this.handleItemButtonOnClick(record.id, !record.enabled)}>
            {record.enabled ? 'Disable' : 'Enable' }
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
            <Breadcrumb.Item>Manage Products</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={24} style={{ marginTop: '24px' }}>
            <Table
              rowKey={record => `item-row-${record.id}`}
              columns={columns}
              dataSource={productsWithStore}
            />
          </Row>
        </PermissionContainer>
      </AppLayout>
    )
  }
}

AdminProductList.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = () => ({})

export default drizzleConnect(AdminProductList, mapStateToProps, mapDispatchToProps)
