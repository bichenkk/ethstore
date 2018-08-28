import React from 'react'
import { Form, Input, Button, InputNumber } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

class ItemForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleOnSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.props.onSubmit(values)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 7,
        },
      },
    }
    return (
      <Form onSubmit={this.handleOnSubmit}>
        <FormItem label='Product Name' {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              type: 'string',
              whitespace: true,
              message: 'Please input a valid name.',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem label='Description' {...formItemLayout}>
          {getFieldDecorator('description', {
            rules: [{
              required: true,
              type: 'string',
              whitespace: true,
              message: 'Please input a valid name.',
            }],
          })(<TextArea rows={2} />)}
        </FormItem>
        <FormItem label='Image URL' {...formItemLayout}>
          {getFieldDecorator('imageUrl', {
            rules: [{
              required: true,
              type: 'url',
              whitespace: true,
              message: 'Please input a valid URL.',
            }],
            initialValue: 'https://s3-ap-southeast-1.amazonaws.com/binatir.dev/store-0.png',
          })(<Input />)}
        </FormItem>
        <FormItem label='Price (ETH)' {...formItemLayout}>
          {getFieldDecorator('price', {
            rules: [{
              required: true,
              type: 'integer',
              whitespace: true,
              message: 'Please input a valid number.',
            }],
          })(<InputNumber addonAfter='ETH' />)}
        </FormItem>
        <FormItem label='Inventory Number' {...formItemLayout}>
          {getFieldDecorator('count', {
            rules: [{
              required: true,
              type: 'integer',
              whitespace: true,
              message: 'Please input a valid number.',
            }],
          })(<InputNumber />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button
            type='primary'
            htmlType='button'
            onClick={this.handleOnSubmit}
          >
              Create Product
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onFieldsChange(changedFields)
  },
  mapPropsToFields(props) {
    const { formFieldValues = {} } = props
    const fields = ['address'].reduce((prev, key) => (
      { ...prev, [key]: Form.createFormField(formFieldValues[key]) }
    ), {})
    return fields
  },
})(ItemForm)

export default CustomizedForm
