import React from 'react'
import { Menu, Button } from 'antd'
import { drizzleConnect } from 'drizzle-react'
import { ContractData } from 'drizzle-react-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AppLayout from '../../components/AppLayout'
import UserProfile from '../../components/UserProfile'
import logoEthStoreHorizontal from '../../assets/logo-ethstore-horizontal.png'
import './index.less'

const SubMenu = { Menu }

class Home extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.contracts = context.drizzle.contracts
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const drizzleInitialized = this.props.drizzleStatus.initialized
    return (
      <AppLayout>
        Home
      </AppLayout>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
    isEditItemLoading,
    isEditItemSuccess,
    editItemTransaction,
    editItemError,
  } = state.home
  return {
    formFieldValues,
    isEditItemLoading,
    isEditItemSuccess,
    editItemTransaction,
    editItemError,
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
  }
}

const mapDispatchToProps = dispatch => ({
})

export default drizzleConnect(Home, mapStateToProps, mapDispatchToProps)
