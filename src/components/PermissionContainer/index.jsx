import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import getContractMethodValue from '../../utils/getContractMethodValue'
import './index.less'

class PermissionContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
    }
  }

  render() {
    return this.props.children
    const { EthStore } = this.props
    const getIdentity = getContractMethodValue(EthStore, 'getIdentity', this.getIdentityDataKey) || {}
    if (this.props.permission === 'administrator' && getIdentity.isAdministrator) {
      return this.props.children
    }
    if (this.props.permission === 'storeOwner' && getIdentity.isStoreOwner) {
      return this.props.children
    }
    return (
      <Card hoverable className='permission-card'>
        <Icon style={{ fontSize: '28px', marginBottom: '24px' }} type='warning' />
        <h1>You don&apos;t have enough permission to view this page.</h1>
        <p>Please go back to the previous page.</p>
      </Card>
    )
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
