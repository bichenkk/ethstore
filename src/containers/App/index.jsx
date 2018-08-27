import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import DrizzleContainer from '../../components/DrizzleContainer'
import Home from '../Home'
import StoreList from '../StoreList'
import NotFound from '../NotFound'
import './index.less'

export default class App extends React.Component {
  render() {
    return (
      <DrizzleContainer>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={() => <Redirect to='/home' />} />
            <Route exact path='/home' component={Home} />
            <Route exact path='/store_list' component={StoreList} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </DrizzleContainer>
    )
  }
}
