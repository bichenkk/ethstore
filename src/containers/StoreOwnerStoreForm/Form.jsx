import React from 'react'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item

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
        <FormItem label='Address' {...formItemLayout}>
          {getFieldDecorator('address', {
            rules: [{
              required: true,
              type: 'string',
              whitespace: true,
              message: 'Please input a valid address.',
            }],
          })(<Input placeholder='0x0000000000000000000000000000000000000000' />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button
            type='primary'
            htmlType='button'
            onClick={this.handleOnSubmit}
          >
              Edit Store
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
