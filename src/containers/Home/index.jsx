import React from 'react'
import { Card, message } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import { ContractData } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Form from './Form'
import LoadingContainer from '../../components/LoadingContainer'
import { editForm, setVariable } from '../../actions/home'
import './index.less'

class Home extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleFormOnSubmit = this.handleFormOnSubmit.bind(this)
    this.contracts = context.drizzle.contracts
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isEditItemLoading
      && nextProps.isEditItemSuccess
      && nextProps.editItemTransaction) {
      const { transactionHash } = nextProps.editItemTransaction
      message.success(`You have successfully created transaction ${transactionHash}.`)
    } else if (this.props.isEditItemLoading && nextProps.editItemError) {
      const errorMessage = nextProps.editItemError.message
      message.error(errorMessage)
    }
  }

  handleFormOnSubmit(values) {
    this.props.setVariable(this.contracts.SimpleStorage, values.myVariable)
  }

  render() {
    const drizzleInitialized = this.props.drizzleStatus.initialized
    const versionDataKey = drizzleInitialized
      && this.contracts.SimpleStorage.methods.version.cacheCall()
    const version = versionDataKey
      && _.get(this.props.SimpleStorage, `version.${versionDataKey}.value`)
    return (
      <LoadingContainer>
        <div className='home-page'>
          <Card title={`Simple Storage ${version || ''}`}>
            <Form
              contractData={<ContractData
                contract='SimpleStorage'
                method='get'
                hideIndicator
              />}
              onSubmit={this.handleFormOnSubmit}
              onFieldsChange={this.props.editForm}
              formFieldValues={this.props.formFieldValues}
              isEditItemLoading={this.props.isEditItemLoading}
            />
          </Card>
        </div>
      </LoadingContainer>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
    isEditItemLoading,
    isEditItemSuccess,
    editItemTransaction,
    editItemError,
  } = state.home
  console.log('state.contracts.SimpleStorage', state.contracts.SimpleStorage)
  return {
    formFieldValues,
    isEditItemLoading,
    isEditItemSuccess,
    editItemTransaction,
    editItemError,
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    SimpleStorage: state.contracts.SimpleStorage,
  }
}

const mapDispatchToProps = dispatch => ({
  editForm: formFieldsChange => dispatch(editForm(formFieldsChange)),
  setVariable: (contract, value) => dispatch(setVariable(contract, value)),
})

export default drizzleConnect(Home, mapStateToProps, mapDispatchToProps)
