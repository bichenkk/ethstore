import React from 'react'
import { Badge } from 'antd'

const BooleanStatus = props => (props.value ? <Badge status='success' /> : <Badge status='error' />)

export default BooleanStatus
