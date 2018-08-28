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

class StoreOwnerProductForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    this.handleFormOnSubmit = this.handleFormOnSubmit.bind(this)
    if (this.EthStore) {
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
    }
  }

  render() {
    return (
      <AppLayout>
        <PermissionContainer permission='storeOwner'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Admin Portal</Breadcrumb.Item>
            <Breadcrumb.Item>Add New Store</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={24} style={{ marginTop: '24px' }}>
            <Card title='Add New Product'>
              <Form
                onSubmit={this.handleFormOnSubmit}
                onFieldsChange={this.props.editForm}
                formFieldValues={this.props.formFieldValues}
                isEditItemLoading={this.props.isEditItemLoading}
              />
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
