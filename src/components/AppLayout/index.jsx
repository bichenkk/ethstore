import React from 'react'
import { drizzleConnect } from 'drizzle-react'
import { Card, Icon } from 'antd'
import PropTypes from 'prop-types'
import logoEthereum from '../../assets/logo-ethereum-white.png'
import logoMetaMask from '../../assets/logo-metamask.png'
import Header from './Header'
import Footer from './Footer'
import './index.less'

class AppLayout extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.contracts = context.drizzle.contracts
  }

  render() {
    const { web3, accounts, drizzleStatus } = this.props
    let content = null
    if (web3.status === 'failed') {
      content = (
        <Card className='reminder-card'>
          <img width='100' src={logoEthereum} alt='Ethereum' />
          <h1>No Ethereum Network Connection</h1>
          This browser has no connection to the Ethereum network.
          Please use the Chrome/FireFox extension MetaMask, or dedicated
           Ethereum browsers Mist or Parity.
        </Card>
      )
    } else if (web3.status === 'initialized' && Object.keys(accounts).length === 0) {
      content = (
        <Card className='reminder-card'>
          <img width='100' src={logoMetaMask} alt='MetaMask' />
          <h1>No Ethereum Account</h1>
          We can&apos;t find any Ethereum accounts!<br />
          Please check and make sure Metamask or your browser are pointed at the correct
           network and your account is unlocked.
        </Card>
      )
    } else if (!drizzleStatus.initialized) {
      content = (
        <Card className='reminder-card'>
          <Icon style={{ fontSize: '28px', marginBottom: '24px' }} type='loading' />
          <p>EthStore is loading...</p>
        </Card>
      )
    } else {
      content = this.props.children
    }
    return (
      <div className='ethstore-app'>
        <Header />
        <div className='content'>
          {content}
        </div>
        <Footer />
      </div>
    )
  }
}

AppLayout.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
  web3: state.web3,
})
const mapDispatchToProps = () => ({})

export default drizzleConnect(AppLayout, mapStateToProps, mapDispatchToProps)
