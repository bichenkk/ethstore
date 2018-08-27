import React from 'react'
import { Menu, Button, Icon } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import logoEthStoreHorizontal from '../../assets/logo-ethstore-horizontal.png'
import getContractMethodValue from '../../utils/getContractMethodValue'
import UserProfile from '../../components/UserProfile'
import './index.less'

const { SubMenu } = Menu

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleWithdrawButtonOnClick = this.handleWithdrawButtonOnClick.bind(this)
    this.EthStore = context.drizzle.contracts.EthStore
    this.getIdentityDataKey = this.EthStore.methods.getIdentity.cacheCall()
    this.addressToBalanceDataKey = this.EthStore.methods.addressToBalance
      .cacheCall(this.props.accounts[0])
  }

  async handleWithdrawButtonOnClick() {
    await this.EthStore.methods.withdrawBalance().send({
      gasLimit: '500000',
    })
  }

  render() {
    const { EthStore } = this.props
    const getIdentity = getContractMethodValue(EthStore, 'getIdentity', this.getIdentityDataKey) || {}
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
            {
              getIdentity.isAdministrator &&
              <SubMenu
                title='Admin Portal'
              >
                <Menu.Item key='admin_add_store'>Add Store</Menu.Item>
                <Menu.Item key='admin_manage_stores'>Manage Stores</Menu.Item>
                <Menu.Item key='admin_manage_products'>Manage Products</Menu.Item>
              </SubMenu>
            }
            {
              getIdentity.isStoreOwner &&
              <SubMenu
                title='Store Owner Portal'
              >
                <Menu.Item key='store_owner_edit_store'>Edit Store</Menu.Item>
                <Menu.Item key='store_owner_add_product'>Add Product</Menu.Item>
                <Menu.Item key='store_owner_manage_products'>Manage Products</Menu.Item>
              </SubMenu>
            }
          </Menu>
          <div className='balance-bar'>
            <div className='balance'>
              <div>Your Balance at EthStore:</div>
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
