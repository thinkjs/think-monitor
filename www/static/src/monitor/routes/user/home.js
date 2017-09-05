import React from 'react';
import reqwest from 'reqwest';
import { Form, Table, Button, Modal, Input, Switch } from 'antd';

import './style.scss';

const { Column } = Table;
const FormItem = Form.Item;

class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      userList: [],
      visible: false,
		}
	}

  componentWillMount() {
    this.requestUsers().then(userList=>this.setState({userList: this.manageUserList(userList)}));
  }

  manageUserList(userList) {
    return userList.map((item,index)=>{
      item.key = index;
      item.project = item.project.join(',');
      item.permisson_level = item.permisson_level == 1 ? '管理员' : '普通用户';
      return item;
    })
  }

  requestUsers() {
    return reqwest({
      url: '/userList',
      method: 'get',
      crossOrigin: true
    })
  }

  addUser(data) {
    return reqwest({
      url: '/addUser',
      method: 'post',
      crossOrigin: true,
      data
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOK = () => {
    this.handleSubmit();
    this.setState({confirmLoading: true});
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.addUser(values).then(res=>{
          if(res.errno == 0) {
            this.requestUsers().then(userList=>this.setState({userList: this.manageUserList(userList), visible:false, confirmLoading: false}));
          }
        })
      }
    });
  }

  render() {
    const { visible, confirmLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
    	<div>
        <Button type="primary" onClick={this.showModal}>添加新用户</Button>
        <Modal title="添加新用户"
          visible={visible}
          onOk={this.handleOK}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} ref="form">
            <FormItem
                {...formItemLayout}
                label="用户名："
                hasFeedback
            >
              {getFieldDecorator('username', {
                rules: [{
                  required: true,
                  message: '请输入用户名'
                }],
              })(
                <Input autoComplete={'off'} />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="密码："
                hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: '请输入密码'
                }],
              })(
                <Input type="password" autoComplete={'off'} />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="是否为管理员："
            >
              {getFieldDecorator('isAdmin', { 
                valuePropName: 'checked',
                initialValue: false
              })(
                <Switch/>
              )}
            </FormItem>
          </Form>
        </Modal>
    		<Table dataSource={this.state.userList}>
          <Column
            title="用户名"
            dataIndex="username"
            key="username"
          />
          <Column
            title="管理的项目"
            dataIndex="project"
            key="project"
          />
          <Column
            title="用户权限"
            dataIndex="permisson_level"
            key="permisson_level"
          />
        </Table>
    	</div>
    );
  }
}

export default Form.create()(UserPage);
