import React from 'react'
import { Menu, Button, Icon } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import UserProfile from '../../components/UserProfile'
import logoEthStoreHorizontal from '../../assets/logo-ethstore-horizontal.png'
import './index.less'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleWithdrawButtonOnClick = this.handleWithdrawButtonOnClick.bind(this)
    this.contracts = context.drizzle.contracts
  }

  componentWillReceiveProps(nextProps) {
  }

  handleWithdrawButtonOnClick() {
  }

  render() {
    const { web3, accounts, drizzleStatus } = this.props
    let contractBalance = null
    if (web3.status === 'failed') {
      contractBalance = <Icon type='loading' />
    } else if (web3.status === 'initialized' && Object.keys(accounts).length === 0) {
      contractBalance = <Icon type='loading' />
    } else if (!drizzleStatus.initialized) {
      contractBalance = <Icon type='loading' />
    } else {
      const getIdentityDataKey = this.contracts.EthStore.methods.getIdentity.cacheCall()
      const getIdentity = (getIdentityDataKey && _.get(this.props.EthStore, `getIdentity.${getIdentityDataKey}.value`)) || {}
      const addressToBalanceDataKey = this.contracts.EthStore.methods.addressToBalance.cacheCall(accounts[0])
      const addressToBalance = (addressToBalanceDataKey && _.get(this.props.EthStore, `addressToBalance.${addressToBalanceDataKey}.value`))
      contractBalance = (
        <div>
          {`${addressToBalance} ETH`}
          <Button>Withdraw</Button>
        </div>
      )
    }
    return (
      <div className='header'>
        <div className='navigation-bar'>
          <div className='left-part'>
            <img className='logo' src={logoEthStoreHorizontal} alt='EthStore' />
          </div>
          <div className='right-part'>
            <UserProfile />
          </div>
        </div>
        <div className='utility-bar'>
          <Menu mode='horizontal' theme='dark'>
            <Menu.Item key='home'>Home</Menu.Item>
          </Menu>
          <div className='balance'>
            <div>
              Your Contract Balance:
              </div>
            <div>
              <div className='balance-value'>{contractBalance}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Header.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
    isWithdrawalLoading,
    isWithdrawalSuccess,
    withdrawalTransaction,
    withdrawalError,
  } = state.app
  return {
    formFieldValues,
    isWithdrawalLoading,
    isWithdrawalSuccess,
    withdrawalTransaction,
    withdrawalError,
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = dispatch => ({
})

export default drizzleConnect(Header, mapStateToProps, mapDispatchToProps)
