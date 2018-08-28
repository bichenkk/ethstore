import React, { Component } from 'react'

export default class ImagePreview extends Component {
  render() {
    const { src } = this.props
    return (src && <img src={src} style={{ objectFit: 'contain', backgroundColor: 'rgb(240, 242, 245)' }} alt='preview' width='50px' height='50px' />) || 'N/A'
  }
}
