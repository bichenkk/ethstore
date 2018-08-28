import React from 'react'
import { Row, Card, Breadcrumb, message } from 'antd'
import { withRouter } from 'react-router-dom'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import { editForm } from '../../actions/storeOwnerProductForm'
import PermissionContainer from '../../components/PermissionContainer'
import Form from './Form'
import getContractMethodValue from '../../utils/getContractMethodValue'
import getFieldFromItem from '../../utils/getFieldFromItem'

class StoreOwnerProductForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    this.handleFormOnSubmit = this.handleFormOnSubmit.bind(this)
    if (this.props.type === 'create') {
      const field = getFieldFromItem(
        {},
        ['name', 'description', 'imageUrl', 'price', 'count'],
      )
      this.props.editForm(field)
    }
    if (this.EthStore) {
      if (this.props.type === 'edit') {
        const { productId } = this.props.match.params
        this.productDataKey = productId && this.EthStore.methods.products.cacheCall(productId - 1)
      }
    }
  }

  componentDidMount() {
    if (this.props.type === 'edit') {
      this.product = getContractMethodValue(this.props.EthStore, 'products', this.productDataKey)
      if (this.product) {
        const field = getFieldFromItem(
          this.product,
          ['name', 'description', 'imageUrl', 'price', 'count'],
        )
        field.price.value = +window.web3.fromWei(this.product.price, 'ether')
        field.count.value = +this.product.count
        this.props.editForm(field)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.product) {
      this.product = getContractMethodValue(this.props.EthStore, 'products', this.productDataKey)
      if (this.product) {
        const field = getFieldFromItem(
          this.product,
          ['name', 'description', 'imageUrl', 'price', 'count'],
        )
        field.price.value = +window.web3.fromWei(this.product.price, 'ether')
        field.count.value = +this.product.count
        this.props.editForm(field)
      }
    }
  }

  async handleFormOnSubmit(values) {
    const {
      name,
      description,
      imageUrl,
      price,
      count,
    } = values
    const weiPrice = window.web3.toWei(price)
    if (this.props.type === 'create') {
      try {
        await this.EthStore.methods.addProduct(name, description, imageUrl, weiPrice, count).send({
          gasLimit: '500000',
        })
        message.success('You have created the product successfully.')
        this.props.history.push(`/store_owner_product_list`)
      } catch (error) {
        message.error(error.message)
      }
    } else if (this.props.type === 'edit') {
      const { productId } = this.props.match.params
      try {
        await this.EthStore.methods.editProduct(productId, name, description, imageUrl, weiPrice, count).send({
          gasLimit: '500000',
        })
        message.success('You have edited the product successfully.')
      } catch (error) {
        message.error(error.message)
      }
    }
  }

  render() {
    const { type } = this.props
    return (
      <AppLayout>
        <PermissionContainer permission='storeOwner'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Admin Portal</Breadcrumb.Item>
            <Breadcrumb.Item>{type === 'create' ? 'Add Product' : 'Edit Product'}</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={24} style={{ marginTop: '24px' }}>
            <Card title={type === 'create' ? 'Add New Product' : 'Edit Product'}>
              {(type === 'create' || (type === 'edit' && this.product)) &&
                <Form
                  type={type}
                  onSubmit={this.handleFormOnSubmit}
                  onFieldsChange={this.props.editForm}
                  formFieldValues={this.props.formFieldValues}
                  isEditItemLoading={this.props.isEditItemLoading}
                />
              }
            </Card>
          </Row>
        </PermissionContainer>
      </AppLayout>
    )
  }
}

StoreOwnerProductForm.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
  } = state.storeOwnerProductForm
  return {
    formFieldValues,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = dispatch => ({
  editForm: formFieldsChange => dispatch(editForm(formFieldsChange)),
})

export default withRouter(drizzleConnect(
  StoreOwnerProductForm,
  mapStateToProps,
  mapDispatchToProps,
))
