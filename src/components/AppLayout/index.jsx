import React from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'
import './index.less'

class AppLayout extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.contracts = context.drizzle.contracts
  }

  render() {
    return (
      <div className='ethstore-app'>
        <Header />
        <div className='content'>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}

AppLayout.contextTypes = {
  drizzle: PropTypes.object,
}

const mapStateToProps = () => ({})
const mapDispatchToProps = () => ({})

export default drizzleConnect(AppLayout, mapStateToProps, mapDispatchToProps)
