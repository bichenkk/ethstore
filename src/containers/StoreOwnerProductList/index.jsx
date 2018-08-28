import React from 'react'
import { Row, Table, Breadcrumb, Button } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import BooleanStatus from '../../components/BooleanStatus'
import ImagePreview from '../../components/ImagePreview'
import StoreCard from '../../components/StoreCard'
import getContractMethodValue from '../../utils/getContractMethodValue'

class StoreOwnerProductList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
      this.storeOwnerToStoreIdDataKey = this.EthStore.methods.storeOwnerToStoreId.cacheCall(this.props.accounts[0])
      this.productCountDataKey = this.EthStore.methods.productCount.cacheCall()
      this.handleItemButtonOnClick = this.handleItemButtonOnClick.bind(this)
      const currentProductCount = getContractMethodValue(this.props.EthStore, 'productCount', this.productCountDataKey) || 0
      this.productDataKeys = (currentProductCount > 0 && _.range(currentProductCount)
        .map((item, index) => this.EthStore.methods.products.cacheCall(index)))
      const storeId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey)
      this.storeDataKey = storeId && this.EthStore.methods.stores.cacheCall(storeId - 1)
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentProductCount = getContractMethodValue(this.props.EthStore, 'productCount', this.productCountDataKey) || 0
    const nextProductCount = getContractMethodValue(nextProps.EthStore, 'productCount', this.productCountDataKey) || 0
    if (currentProductCount !== nextProductCount) {
      this.productDataKeys = (nextProductCount > 0 && _.range(nextProductCount)
        .map((item, index) => this.EthStore.methods.products.cacheCall(index)))
    }
    const currentStoreId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey) || 0
    const nextStoreId = getContractMethodValue(nextProps.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey) || 0
    if (currentStoreId !== nextStoreId) {
      this.storeDataKey = nextStoreId && this.EthStore.methods.stores.cacheCall(nextStoreId - 1)
    }
  }

  async handleItemButtonOnClick(productId) {
  }

  render() {
    const { EthStore } = this.props
    const products = (this.productDataKeys && this.productDataKeys
      .map(dataKey => getContractMethodValue(EthStore, 'products', dataKey))
      .filter(product => product
        && Object.keys(product).length > 0)
    ) || []
    const storeId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey)
    const productsWithStore = products
      .filter(item => item.storeId && item.storeId === storeId)
    const store = this.storeDataKey && storeId && getContractMethodValue(EthStore, 'stores', this.storeDataKey)
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
      },
      // {
      //   dataIndex: 'action',
      //   key: 'action',
      //   render: (value, record) => (
      //     <Button onClick={() => this.handleItemButtonOnClick(record.id)}>
      //       View
      //     </Button>
      //   ),
      // },
    ]
    return (
      <AppLayout>
        <div>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Store Owner Portal</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Products</Breadcrumb.Item>
          </Breadcrumb>
          {
            store && <StoreCard store={store} />
          }
          <Row gutter={24} style={{ marginTop: '24px' }}>
            <Table
              rowKey={record => `item-row-${record.id}`}
              columns={columns}
              dataSource={productsWithStore}
            />
          </Row>
        </div>
      </AppLayout>
    )
  }
}

StoreOwnerProductList.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = () => ({})

export default drizzleConnect(StoreOwnerProductList, mapStateToProps, mapDispatchToProps)
