import React from 'react'
import { Menu, Button, Icon } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import logoEthStoreHorizontal from '../../assets/logo-ethstore-horizontal.png'
import getContractMethodValue from '../../utils/getContractMethodValue'
import UserProfile from '../../components/UserProfile'
import './index.less'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleWithdrawButtonOnClick = this.handleWithdrawButtonOnClick.bind(this)
    this.EthStore = context.drizzle.contracts.EthStore
    this.addressToBalanceDataKey = this.EthStore.methods.addressToBalance
      .cacheCall(this.props.accounts[0])
  }

  async handleWithdrawButtonOnClick() {
    await this.EthStore.methods.withdrawBalance().send({
      gasLimit: '100000',
    })
  }

  render() {
    const { EthStore } = this.props
    const addressToBalance = getContractMethodValue(EthStore, 'addressToBalance', this.addressToBalanceDataKey) || 0
    return (
      <div className='header' >
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
            <div className='balance'>
              <div>Your Contract Balance:</div>
              <div>
                <div className='balance-value'>
                  <div>
                    {`${window.web3.fromWei(addressToBalance, 'ether')} ETH`}
                    <Button type='dashed' icon='arrow-up' onClick={this.handleWithdrawButtonOnClick}>Withdraw</Button>
                  </div>
                </div>
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
    EthStore: state.contracts.EthStore,
  }
}

const mapDispatchToProps = dispatch => ({
})

export default drizzleConnect(Header, mapStateToProps, mapDispatchToProps)
