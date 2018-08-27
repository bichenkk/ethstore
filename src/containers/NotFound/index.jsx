import React from 'react'
import { Card, Icon, Button } from 'antd'
import logoEthStore from '../../assets/logo-ethstore-horizontal.png'
import './index.less'

class NotFound extends React.Component {
  render() {
    return (
      <div className='notfound-container'>
        <img src={logoEthStore} alt='EthStore' />
        <Card hoverable className='notfound-card'>
          <Icon style={{ fontSize: '28px', marginBottom: '24px' }} type='warning' />
          <h1>This page doesn&apos;t exist.</h1>
          <p>Please go back to EthStore</p>
        </Card>
      </div>
    )
  }
}

export default NotFound
