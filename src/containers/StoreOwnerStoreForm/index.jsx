import React from 'react'
import { Row, Card, Breadcrumb, message } from 'antd'
import { withRouter } from 'react-router-dom'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import { editForm } from '../../actions/storeOwnerStoreForm'
import PermissionContainer from '../../components/PermissionContainer'
import Form from './Form'
import getContractMethodValue from '../../utils/getContractMethodValue'
import getFieldFromItem from '../../utils/getFieldFromItem'

class StoreOwnerStoreForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    this.handleFormOnSubmit = this.handleFormOnSubmit.bind(this)
    this.storeOwnerToStoreIdDataKey = this.EthStore.methods.storeOwnerToStoreId.cacheCall(this.props.accounts[0])
    if (this.EthStore) {
      const storeId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey)
      this.storeDataKey = storeId && this.EthStore.methods.stores.cacheCall(storeId - 1)
      this.store = this.storeDataKey && storeId && getContractMethodValue(this.props.EthStore, 'stores', this.storeDataKey)
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentStoreId = getContractMethodValue(this.props.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey) || 0
    const nextStoreId = getContractMethodValue(nextProps.EthStore, 'storeOwnerToStoreId', this.storeOwnerToStoreIdDataKey) || 0
    if (currentStoreId !== nextStoreId || !this.store) {
      this.storeDataKey = nextStoreId && this.EthStore.methods.stores.cacheCall(nextStoreId - 1)
      this.store = this.storeDataKey && nextStoreId && getContractMethodValue(this.props.EthStore, 'stores', this.storeDataKey)
      if (this.store) {
        const field = getFieldFromItem(
          this.store,
          ['name', 'description', 'imageUrl'],
        )
        this.props.editForm(field)
      }
    }
  }

  async handleFormOnSubmit(values) {
    const {
      name,
      description,
      imageUrl,
    } = values
    try {
      await this.EthStore.methods.editStore(name, description, imageUrl).send({
        gasLimit: '500000',
      })
      message.success('You have edited the store successfully.')
    } catch (error) {
      message.error(error.message)
    }
  }

  render() {
    return (
      <AppLayout>
        <PermissionContainer permission='storeOwner'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
            <Breadcrumb.Item>Store Owner Portal</Breadcrumb.Item>
            <Breadcrumb.Item>Edit Store</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={24} style={{ marginTop: '24px' }}>
            <Card title='Edit Store'>
              {
                this.store && <Form
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

StoreOwnerStoreForm.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
  } = state.storeOwnerStoreForm
  return {
    formFieldValues,
    accounts: state.accounts,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = dispatch => ({
  editForm: formFieldsChange => dispatch(editForm(formFieldsChange)),
})

export default withRouter(drizzleConnect(StoreOwnerStoreForm, mapStateToProps, mapDispatchToProps))