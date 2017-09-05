import React from 'react';
import reqwest from 'reqwest';
import { Form, Input, Button, Modal, Table } from 'antd';
const FormItem = Form.Item;
const { Column } = Table;
import './style.scss';

class InitProject extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      visible: false,
      projectList: []
		}
	}

  componentWillMount() {
    this.requestProject().then(data=>this.setState({projectList: this.managePojectList(data)}));
  }

  managePojectList(data) {
    return data.projects.map((item,index)=>{
      item.key = index;
      item.snippets = 
      `
        const Client = require('think-monitor/service/client');\n
        Client({hostname: '${data.hostname}', port: ${data.port}, hash: '${item.hash}'});
      `
      return item;
    })
  }

	handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      	this.addProject(values).
      		then(()=>{
            this.requestProject().then(data=>this.setState({visible: false, confirmLoading: false, projectList: this.managePojectList(data)}))
      		}).catch(e=>console.log(e));
      }
    });
  }

  addProject = (data) => {
		return reqwest({
      url: '/addProject',
      method: 'post',
      crossOrigin: true,
      data
    })  	
  }

  requestProject = ()=>{
    return reqwest({
      url: '/projectList',
      method: 'get',
      crossOrigin: true
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
  gotoMonitor = () => {
  	location.href = '/monitor';
  }
  
  render() {
		const { getFieldDecorator } = this.props.form;
    const { visible, confirmLoading } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>添加新项目</Button>
        <Modal title="添加新项目"
          visible={visible}
          onOk={this.handleOK}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
                {...formItemLayout}
                label="项目名称"
                hasFeedback
            >
              {getFieldDecorator('influx_name', {
                rules: [{
                  required: true,
                  message: '请输入项目名称'
                }],
              })(
                <Input autoComplete={'off'} />
              )}
            </FormItem>
        </Form>
        </Modal>
        <Table dataSource={this.state.projectList}>
          <Column
            title="项目名称"
            dataIndex="project_name"
            key="project_name"
          />
          <Column
            title="hash值"
            dataIndex="hash"
            key="hash"
          />
          <Column
            title="Code Snippets"
            dataIndex="snippets"
            key="snippets"
          />
        </Table>
      </div>
    );
  }
}
export default Form.create()(InitProject);
