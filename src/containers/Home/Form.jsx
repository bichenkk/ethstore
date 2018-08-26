import React from 'react'
import { Form, InputNumber, Button } from 'antd'
import { keys } from '../../actions/home'

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
    const { getFieldDecorator, getFieldsValue } = this.props.form
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
        <FormItem label='Current' {...formItemLayout}>
          {this.props.contractData}
        </FormItem>
        <FormItem label='New' {...formItemLayout}>
          {getFieldDecorator('myVariable', {
            rules: [{ required: true, type: 'number',  whitespace: true, message: 'Please input a valid value.' }],
          })(<InputNumber />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button
            loading={this.props.isEditItemLoading}
            type='primary'
            htmlType='button'
            onClick={this.handleOnSubmit}
          >
            Set Variable
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
    const fields = keys.reduce((prev, key) => (
      { ...prev, [key]: Form.createFormField(formFieldValues[key]) }
    ), {})
    return fields
  },
  // onValuesChange(_, values) {
  //   console.log(values)
  // },
})(ItemForm)

export default CustomizedForm
