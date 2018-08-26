import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import { Avatar } from 'antd'
import { createIcon } from '@download/blockies'
import _ from 'lodash'
import PropTypes from 'prop-types'
import logoMetaMask from '../../assets/logo-metamask.png'
import './index.less'

const avatarProps = {
  style: { marginRight: '12px' },
}

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context)
    this.contracts = context.drizzle.contracts
  }

  render() {
    const { web3, accounts, drizzleStatus } = this.props
    let title = null
    let subtitle = null
    if (web3.status === 'failed') {
      title = 'No connection'
      subtitle = 'Please connect to Localhost 8545'
      avatarProps.src = logoMetaMask
    } else if (web3.status === 'initialized' && Object.keys(accounts).length === 0) {
      title = 'No accounts available'
      subtitle = 'Please check your MetaMask'
      avatarProps.src = logoMetaMask
    } else if (!drizzleStatus.initialized) {
      title = 'Loading'
      subtitle = 'Please wait'
      delete avatarProps.src
      avatarProps.icon = 'loading'
    } else {
      const getIdentityDataKey = this.contracts.EthStore.methods.getIdentity.cacheCall()
      const getIdentity = (getIdentityDataKey && _.get(this.props.EthStore, `getIdentity.${getIdentityDataKey}.value`)) || {}
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
      title = accounts && accounts[0] && `${accounts[0].substring(0, 7)}...`
      subtitle = identities.join(', ')
    }
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
  drizzleStatus: state.drizzleStatus,
  web3: state.web3,
  EthStore: state.contracts.EthStore,
})

export default drizzleConnect(UserProfile, mapStateToProps)
