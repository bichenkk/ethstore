import React from 'react'

export default class Web3Container extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.selectedAddress = null
    this.networkVersion = null
    this.checkUpdate = this.checkUpdate.bind(this)
    window.web3.currentProvider.publicConfigStore.on('update', this.checkUpdate)
  }

  checkUpdate({ selectedAddress, networkVersion }) {
    if (!this.selectedAddress) {
      this.selectedAddress = selectedAddress
    } else if (selectedAddress !== this.selectedAddress) {
      window.location.reload()
    }
    if (!this.networkVersion) {
      this.networkVersion = networkVersion
    } else if (networkVersion !== this.networkVersion) {
      window.location.reload()
    }
  }

  render() {
    return this.props.children
  }
}
