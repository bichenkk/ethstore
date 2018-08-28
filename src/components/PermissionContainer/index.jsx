import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import getContractMethodValue from '../../utils/getContractMethodValue'

class PermissionContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
    }
  }

  render() {
    const { EthStore } = this.props
    const getIdentity = getContractMethodValue(EthStore, 'getIdentity', this.getIdentityDataKey) || {}
    if (this.props.permission === 'administrator' && getIdentity.isAdministrator) {
      return this.props.children
    }
    if (this.props.permission === 'storeOwner' && getIdentity.isStoreOwner) {
      return this.props.children
    }
    return 'No Permission'
  }
}

PermissionContainer.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  EthStore: state.contracts.EthStore,
})

export default drizzleConnect(PermissionContainer, mapStateToProps)
