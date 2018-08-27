import React from 'react'
import { Card, Button } from 'antd'
import logoEthStore from '../../assets/logo-ethstore-vertical-white.png'
import './index.less'

class IntroductionCard extends React.Component {
  render() {
    return (
      <Card hoverable className='introduction-card'>
        <img width='100' src={logoEthStore} alt='EthStore' />
        <p>
          EthStore is a new marketplace based on Ethereum. Everything is recorded by Smart Contract.
        </p>
      </Card>
    )
  }
}

export default IntroductionCard
