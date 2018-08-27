import React from 'react'
import { Row, Card, Breadcrumb, message } from 'antd'
import { withRouter } from 'react-router-dom'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import { editForm } from '../../actions/adminStoreForm'
import Form from './Form'

class AdminStoreForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    this.handleFormOnSubmit = this.handleFormOnSubmit.bind(this)
  }

  async handleFormOnSubmit(values) {
    try {
      await this.EthStore.methods.createStore(values.address).send({
        gasLimit: '500000',
      })
      this.props.history.push(`/admin_store_list`)
    } catch (error) {
      message.error(error.message)
    }
  }

  render() {
    return (
      <AppLayout>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item><a href='/'>EthStore</a></Breadcrumb.Item>
          <Breadcrumb.Item>Admin Portal</Breadcrumb.Item>
          <Breadcrumb.Item>Create Store</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={24} style={{ marginTop: '24px' }}>
          <Card title='Create New Store'>
            <Form
              onSubmit={this.handleFormOnSubmit}
              onFieldsChange={this.props.editForm}
              formFieldValues={this.props.formFieldValues}
              isEditItemLoading={this.props.isEditItemLoading}
            />
          </Card>
        </Row>
      </AppLayout>
    )
  }
}

AdminStoreForm.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
  } = state.adminStoreForm
  return {
    formFieldValues,
  }
}

const mapDispatchToProps = dispatch => ({
  editForm: formFieldsChange => dispatch(editForm(formFieldsChange)),
})

export default withRouter(drizzleConnect(AdminStoreForm, mapStateToProps, mapDispatchToProps))
