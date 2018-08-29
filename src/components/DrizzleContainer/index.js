import React from 'react'
import { drizzleConnect } from 'drizzle-react'
import { Card, Icon, Button } from 'antd'
import _ from 'lodash'
import PropTypes from 'prop-types'
import logoEthStore from '../../assets/logo-ethstore-horizontal.png'
import logoEthereum from '../../assets/logo-ethereum-white.png'
import logoMetaMask from '../../assets/logo-metamask.png'
import truffleConfig from '../../../truffle'
import './index.less'

const { networks } = truffleConfig
const { networkId } = networks[window.ETH_NETWORK]
const networkName = _.capitalize(window.ETH_NETWORK)

class DrizzleContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleReloadButtonOnClick = this.handleReloadButtonOnClick.bind(this)
  }

  handleReloadButtonOnClick() {
    window.location.reload()
  }

  render() {
    const { web3, accounts, drizzleStatus } = this.props
    if (!window.web3) {
      return (
        <div className='drizzle-container'>
          <img src={logoEthStore} alt='EthStore' />
          <Card hoverable className='reminder-card'>
            <img width='100' src={logoMetaMask} alt='MetaMask' />
            <h1>No MetaMask Installed</h1>
            Please install MetaMask in order to use EthStore.
            <div><Button type='dashed' icon='reload' onClick={this.handleReloadButtonOnClick}>Reload</Button></div>
          </Card>
        </div>
      )
    } else if (web3.status === 'failed') {
      return (
        <div className='drizzle-container'>
          <img src={logoEthStore} alt='EthStore' />
          <Card hoverable className='reminder-card'>
            <img width='100' src={logoEthereum} alt='Ethereum' />
            <h1>No Ethereum Network Connection</h1>
            This browser has no connection to the Ethereum network.
            Please use the Chrome/FireFox extension MetaMask, or dedicated
             Ethereum browsers Mist or Parity.
            <div><Button type='dashed' icon='reload' onClick={this.handleReloadButtonOnClick}>Reload</Button></div>
          </Card>
        </div>
      )
    } else if (web3.status === 'initialized' && Object.keys(accounts).length === 0) {
      return (
        <div className='drizzle-container'>
          <img src={logoEthStore} alt='EthStore' />
          <Card hoverable className='reminder-card'>
            <img width='100' src={logoMetaMask} alt='MetaMask' />
            <h1>No Ethereum Account</h1>
            We can&apos;t find any Ethereum accounts!<br />
            Please check and make sure Metamask or your browser are pointed at the correct
             network and your account is unlocked.
            <div><Button type='dashed' icon='reload' onClick={this.handleReloadButtonOnClick}>Reload</Button></div>
          </Card>
        </div>
      )
    } else if (web3.status === 'initialized' && `${networkId}` !== '*' && `${web3.networkId}` !== `${networkId}`) {
      return (
        <div className='drizzle-container'>
          <img src={logoEthStore} alt='EthStore' />
          <Card hoverable className='reminder-card'>
            <img width='100' src={logoEthereum} alt='Ethereum' />
            <h1>Not Connected to {networkName} Network</h1>
            Please check and make sure Metamask or your browser are pointed at the correct
             network.
            <div><Button type='dashed' icon='reload' onClick={this.handleReloadButtonOnClick}>Reload</Button></div>
          </Card>
        </div>
      )
    } else if (!drizzleStatus.initialized) {
      return (
        <div className='drizzle-container'>
          <img src={logoEthStore} alt='EthStore' />
          <Card hoverable className='reminder-card'>
            <Icon style={{ fontSize: '28px', marginBottom: '24px' }} type='loading' />
            <p>EthStore is loading...</p>
            <div><Button type='dashed' icon='reload' onClick={this.handleReloadButtonOnClick}>Reload</Button></div>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}

DrizzleContainer.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
  web3: state.web3,
})
const mapDispatchToProps = () => ({})

export default drizzleConnect(DrizzleContainer, mapStateToProps, mapDispatchToProps)
