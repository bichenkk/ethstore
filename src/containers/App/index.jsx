import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import DrizzleContainer from '../../components/DrizzleContainer'
import Home from '../Home'
import StoreList from '../StoreList'
import StoreProductList from '../StoreProductList'
import AdminStoreForm from '../AdminStoreForm'
import AdminStoreList from '../AdminStoreList'
import AdminProductList from '../AdminProductList'
import AdminTransactionList from '../AdminTransactionList'
import StoreOwnerProductForm from '../StoreOwnerProductForm'
import StoreOwnerProductList from '../StoreOwnerProductList'
import StoreOwnerTransactionList from '../StoreOwnerTransactionList'
import StoreOwnerStoreForm from '../StoreOwnerStoreForm'
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
            <Route exact path='/store_list/:storeId' component={StoreProductList} />
            <Route exact path='/admin_store_form' component={AdminStoreForm} />
            <Route exact path='/admin_store_list' component={AdminStoreList} />
            <Route exact path='/admin_product_list' component={AdminProductList} />
            <Route exact path='/admin_transaction_list' component={AdminTransactionList} />
            <Route exact path='/store_owner_store_form' component={StoreOwnerStoreForm} />
            <Route exact path='/store_owner_product_form' component={props => <StoreOwnerProductForm {...props} type='create' />} />
            <Route exact path='/store_owner_product_list' component={StoreOwnerProductList} />
            <Route exact path='/store_owner_product_form/:productId' component={props => <StoreOwnerProductForm {...props} type='edit' />} />
            <Route exact path='/store_owner_transaction_list' component={StoreOwnerTransactionList} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </DrizzleContainer>
    )
  }
}
