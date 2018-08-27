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

  async handleWithdrawButtonOnClick() {
    const { EthStore } = this.contracts
    const transaction = await EthStore.methods.withdrawBalance().send()
    console.log('transaction', transaction)
  }

  render() {
    const { web3, accounts, drizzleStatus } = this.props
    // let addressBalance = null
    let contractBalance = null
    if (web3.status === 'failed') {
      // addressBalance = <Icon type='loading' />
      contractBalance = <Icon type='loading' />
    } else if (web3.status === 'initialized' && Object.keys(accounts).length === 0) {
      // addressBalance = <Icon type='loading' />
      contractBalance = <Icon type='loading' />
    } else if (!drizzleStatus.initialized) {
      contractBalance = <Icon type='loading' />
      // addressBalance = <Icon type='loading' />
    } else {
      const getIdentityDataKey = this.contracts.EthStore.methods.getIdentity.cacheCall()
      const getIdentity = (getIdentityDataKey && _.get(this.props.EthStore, `getIdentity.${getIdentityDataKey}.value`)) || {}
      const addressToBalanceDataKey = this.contracts.EthStore.methods.addressToBalance.cacheCall(accounts[0])
      const addressToBalance = (addressToBalanceDataKey && _.get(this.props.EthStore, `addressToBalance.${addressToBalanceDataKey}.value`)) || 0
      // addressBalance = (accounts[0] && window.web3.eth.getBalance(accounts[0])) || 'NA'
      contractBalance = (
        <div>
          {`${window.web3.fromWei(addressToBalance, 'ether')} ETH`}
          <Button onClick={this.handleWithdrawButtonOnClick}>Withdraw</Button>
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
          <div className='balance-bar'>
            {/* <div className='balance'>
              <div>Your Address Balance:</div>
              <div>
                <div className='balance-value'>{addressBalance}</div>
              </div>
            </div> */}
            <div className='balance'>
              <div>Your Contract Balance:</div>
              <div>
                <div className='balance-value'>{contractBalance}</div>
              </div>
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
