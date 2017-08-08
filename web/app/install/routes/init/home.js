import React from 'react';
import reqwest from 'reqwest';
import { Form, Input, Button } from 'antd';
import './style.scss';
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
      	this.requestInit(values).
      		then(res=>{
      			if(res.errno == 0) {
      				this.props.history.push('/project')
      			}
      		}).catch(e=>console.log(e));
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
    	<div className="init-mysql">
	      <Form onSubmit={this.handleSubmit} layout="inline">
	        <div className="form-top-content">
	        	<h3 className="form-header">管理账号信息</h3>
						<FormItem
			          label="账号"
			          hasFeedback
		        >
		          {getFieldDecorator('user_account', {
		            rules: [{
		              required: true,
		              message: '请输入管理者账号'
		            }],
		          })(
		            <Input autoComplete={'off'} />
		          )}
		        </FormItem>
		        <FormItem
			          label="密码"
			          hasFeedback
		        >
		          {getFieldDecorator('user_password', {
		            rules: [{
		              required: true,
		              message: '请输入管理者密码'
		            }],
		          })(
		            <Input autoComplete={'off'} type="password" />
		          )}
		        </FormItem>
	        </div>
	        <div className="form-middle-content">
						<h3 className="form-header">MYSQL信息</h3>
						<FormItem
			          label="账号"
			          hasFeedback
		        >
		          {getFieldDecorator('mysql_user', {
		            rules: [{
		              required: true,
		              message: '请输入MySQL账号'
		            }],
		            initialValue: 'root'
		          })(
		            <Input autoComplete={'off'} placeholder="数据库账号"/>
		          )}
		        </FormItem>
		        <FormItem
			          label="主机"
			          hasFeedback
		        >
		          {getFieldDecorator('mysql_host', {
		            rules: [{
		              required: true,
		              message: '请输入MySQL主机名'
		            }],
		            initialValue: '127.0.0.1'
		          })(
		            <Input autoComplete={'off'} placeholder="数据库主机地址" />
		          )}
		        </FormItem>
		        <FormItem
			          label="密码"
			          hasFeedback
		        >
		          {getFieldDecorator('mysql_password', {
		            rules: [{
		              required: true,
		              message: '请输入MySQL密码'
		            }],
		            initialValue: 'lipuyang1996'
		          })(
		            <Input type="password" autoComplete={'off'} placeholder="数据库密码" />
		          )}
		        </FormItem>
						<FormItem
			          label="端口"
			          hasFeedback
		        >
		          {getFieldDecorator('mysql_port', {
		            rules: [{
		              required: true,
		              message: '请输入MySQL端口'
		            }],
		            initialValue: '3306'
		          })(
		            <Input autoComplete={'off'} placeholder="数据库端口" />
		          )}
		        </FormItem>	 
						<FormItem
			          label="数据库名"
			          hasFeedback
		        >
		          {getFieldDecorator('mysql_database', {
		            rules: [{
		              required: true,
		              message: '请输入MySQL数据库名'
		            }],
		            initialValue: 'think-monitor'
		          })(
		            <Input autoComplete={'off'} placeholder="数据库名" />
		          )}
		        </FormItem>
	        	
	        </div>
	      	<div className="form-bottom-content">
						<h3 className="form-header">influxDB信息</h3>
		        <FormItem
			          label="主机"
			          hasFeedback
		        >
		          {getFieldDecorator('influx_host', {
		            rules: [{
		              required: true,
		              message: '请输入influxDB主机名'
		            }],
		            initialValue: '127.0.0.1'
		          })(
		            <Input autoComplete={'off'} placeholder="数据库主机地址" />
		          )}
		        </FormItem>
						<FormItem
			          label="端口"
			          hasFeedback
		        >
		          {getFieldDecorator('influx_port', {
		            rules: [{
		              required: true,
		              message: '请输入influxDB端口'
		            }],
		            initialValue: '8086'
		          })(
		            <Input autoComplete={'off'} placeholder="数据库端口" />
		          )}
		        </FormItem>
	      	</div>
          <Button type="primary" htmlType="submit" className="form-submit-btn">开始配置MySQL</Button>
	      </Form>	      
    	</div>
    );
  }
}

export default Form.create()(RegistrationForm);
