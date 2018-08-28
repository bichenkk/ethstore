import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import { Avatar } from 'antd'
import { createIcon } from '@download/blockies'
import _ from 'lodash'
import PropTypes from 'prop-types'
import getContractMethodValue from '../../utils/getContractMethodValue'
import './index.less'

const avatarProps = {
  style: { marginRight: '12px' },
}

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context)
    this.EthStore = context.drizzle.contracts.EthStore
    if (this.EthStore) {
      this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
    }
  }

  render() {
    const { accounts, EthStore } = this.props
    const getIdentity = getContractMethodValue(EthStore, 'getIdentity', this.getIdentityDataKey) || {}
    const identities = []
    getIdentity.isAdministrator && identities.push('Administrator')
    getIdentity.isStoreOwner && identities.push('Store Owner')
    delete avatarProps.icon
    const avatar = createIcon({ // All options are optional
      seed: accounts[0], // seed used to generate icon data, default: random
      color: '#dfe', // to manually specify the icon color, default: random
      bgcolor: '#aaa', // choose a different background color, default: white
      size: 15, // width/height of the icon in blocks, default: 10
      scale: 3, // width/height of each block in pixels, default: 5
    }).toDataURL()
    avatarProps.src = avatar
    const title = accounts && accounts[0] && `${accounts[0].substring(0, 7)}...`
    const subtitle = identities.join(', ')
    return (
      <div className='user-profile'>
        <Avatar {...avatarProps} />
        <div className='information'>
          <div style={{ marginBottom: '3px', color: 'black' }}>{title}</div>
          <div style={{ fontSize: '12px' }}>{subtitle}</div>
        </div>
      </div>
    )
  }
}

UserProfile.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  EthStore: state.contracts.EthStore,
})

export default drizzleConnect(UserProfile, mapStateToProps)
