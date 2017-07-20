import React from 'react';
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import './style.css';
const FormItem = Form.Item;
import reqwest from 'reqwest';

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      	this.requestInit(values).
      	then(res=>console.log(res));
      }
    });
  }

  requestInit = (data) => {
		return reqwest({
      url: '/init',
      method: 'post',
      crossOrigin: true,
      data
    })  	
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
    	<div>
	      <Form onSubmit={this.handleSubmit} layout="inline">
	        <div className="form-top-content">
	        	<h3 className="form-header">数据库信息</h3>
						<FormItem
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
	        </div>
	      	<div className="form-bottom-content">
	      		<h3 className="form-header">管理账号信息</h3>
						<FormItem
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
	      	</div>
          <Button type="primary" htmlType="submit" className="form-submit-btn">开始安装</Button>
	      </Form>	      
    	</div>
    );
  }
}

export default Form.create()(RegistrationForm);
