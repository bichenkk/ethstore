import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'

class LoadingContainer extends Component {
  render() {
    if (this.props.web3.status === 'failed') {
      if (this.props.errorComp) {
        return this.props.errorComp
      }

      return (
        <Card>
          <h1><span role='img' aria-label='emoji'>⚠️</span></h1>
          <p>
            This browser has no connection to the Ethereum network.
            Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.
          </p>
        </Card>
      )
    }

    if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) {
      return (
        <Card>
          <h1><span role='img' aria-label='emoji'>🦊</span></h1>
          <p>
            <strong>We can't find any Ethereum accounts!</strong>
            Please check and make sure Metamask or your browser are pointed at the correct network and your account is unlocked.
          </p>
        </Card>
      )
    }

    if (this.props.drizzleStatus.initialized) {
      return Children.only(this.props.children)
    }

    if (this.props.loadingComp) {
      return this.props.loadingComp
    }

    return (
      <Card>
        <h1><span role='img' aria-label='emoji'>⚙️</span></h1>
        <p>Loading dapp...</p>
      </Card>
    )
  }
}
LoadingContainer.contextTypes = {
  drizzle: PropTypes.object,
}
/*
 * Export connected component.
 */
const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
  web3: state.web3,
})

export default drizzleConnect(LoadingContainer, mapStateToProps)
