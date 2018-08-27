import React from 'react'
import { Row, Col, Icon } from 'antd'
import logoWhite from '../../assets/logo-ethstore-icon-white.png'

class Footer extends React.Component {
  render() {
    return (
      <div className='footer'>
        <div className='links-bar'>
          <div>
            <Col span={8} className='links-section'>
              <b>Author</b>
              <ul>
                <li>KK Chen</li>
                <li><a href='mailto:kk@bichenkk.com'>kk@bichenkk.com</a></li>
              </ul>
            </Col>
          </div>
          <div className='links-section social-section'>
            <b>Follow Me</b>
            <ul>
              <li><a href='https://github.com/bichenkk'><Icon type='github' /></a></li>
            </ul>
          </div>
        </div>
        <Row className='terms-bar'>
          <Col span={8} className='left-part'>
            <ul>
              <li><a href='https://github.com/bichenkk/ethstore'>Project Github</a></li>
            </ul>
          </Col>
          <Col span={8} className='center-part'>
            <img className='logo' src={logoWhite} alt='EthStore' />
          </Col>
          <Col span={8} className='right-part'>
            @2018 bichenkk.com
          </Col>
        </Row>
      </div>
    )
  }
}

export default Footer
