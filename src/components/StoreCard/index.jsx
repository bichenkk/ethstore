import React from 'react'
import { createIcon } from '@download/blockies'
import { Card } from 'antd'
import _ from 'lodash'
import './index.less'

class StoreCard extends React.Component {
  render() {
    const { store } = this.props
    const {
      storeOwner,
      name,
      description,
      imageUrl,
      productCount,
    } = store
    const avatar = createIcon({ // All options are optional
      seed: storeOwner, // seed used to generate icon data, default: random
      color: '#dfe', // to manually specify the icon color, default: random
      bgcolor: '#aaa', // choose a different background color, default: white
      size: 15, // width/height of the icon in blocks, default: 10
      scale: 3, // width/height of each block in pixels, default: 5
    }).toDataURL()
    return (
      <Card hoverable className='store-card'>
        <img src={imageUrl || avatar} alt={name} />
        <div className='information'>
          <div className='title'><b>{name || 'N/A'}</b></div>
          <div className='description'>
            {
              _.truncate(description, {
                length: 70,
                omission: '...',
              })
            }
          </div>
          <div className='description'>
            {`${productCount} Products`}
          </div>
          <div className='merchant'>
            Owned By
            <img src={avatar} alt='avatar' />
            {storeOwner}
          </div>
        </div>
      </Card>
    )
  }
}

export default StoreCard
