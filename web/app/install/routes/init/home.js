import React from 'react';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
    	<div>
				<h3>数据库信息</h3>
	      <Form onSubmit={this.handleSubmit}>
	        <FormItem
		          {...formItemLayout}
		          label="账号"
		          hasFeedback
	        >
	          {getFieldDecorator('db_account', {
	            rules: [{
	              required: true
	            }],
	          })(
	            <Input placeholder="数据库账号"/>
	          )}
	        </FormItem>
	        <FormItem
		          {...formItemLayout}
		          label="主机"
		          hasFeedback
	        >
	          {getFieldDecorator('db_address', {
	            rules: [{
	              required: true
	            }],
	          })(
	            <Input placeholder="数据库主机地址" />
	          )}
	        </FormItem>
	        <FormItem
		          {...formItemLayout}
		          label="密码"
		          hasFeedback
	        >
	          {getFieldDecorator('db_password', {
	            rules: [{
	              required: true
	            }],
	          })(
	            <Input type="password" placeholder="数据库密码" />
	          )}
	        </FormItem>
					<FormItem
		          {...formItemLayout}
		          label="端口"
		          hasFeedback
	        >
	          {getFieldDecorator('db_port', {
	            rules: [{
	              required: true
	            }]
	          })(
	            <Input placeholder="数据库端口" />
	          )}
	        </FormItem>	 
					<FormItem
		          {...formItemLayout}
		          label="数据库名"
		          hasFeedback
	        >
	          {getFieldDecorator('db_name', {
	            rules: [{
	              required: true
	            }]
	          })(
	            <Input placeholder="数据库名" />
	          )}
	        </FormItem>
	      	<h3>管理账号信息</h3>
	        <FormItem
		          {...formItemLayout}
		          label="账号"
		          hasFeedback
	        >
	          {getFieldDecorator('user_account', {
	            rules: [{
	              required: true,
	            }],
	          })(
	            <Input />
	          )}
	        </FormItem>
	        <FormItem
		          {...formItemLayout}
		          label="密码"
		          hasFeedback
	        >
	          {getFieldDecorator('user_password', {
	            rules: [{
	              required: true,
	            }],
	          })(
	            <Input type="password" />
	          )}
	        </FormItem>
	        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">开始安装</Button>
        	</FormItem>
	      </Form>	      
    	</div>
    );
  }
}

export default Form.create()(RegistrationForm);
