import React from 'react';
import reqwest from 'reqwest';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;
import './style.scss';

class InitProject extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hash : ''
		}
	}

	handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      	this.requestInit(values).
      		then(res=>{
      			this.setState({hash: res.hash});
      		}).catch(e=>console.log(e));
      }
    });
  }

  requestInit = (data) => {
		return reqwest({
      url: '/initProject',
      method: 'post',
      crossOrigin: true,
      data
    })  	
  }

  gotoMonitor = () => {
  	location.href = '/monitor';
  }
  
  render() {
		const { getFieldDecorator } = this.props.form;
    return (
    	<div>
				<Form onSubmit={this.handleSubmit} layout="inline">
						<FormItem
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
          <Button type="primary" htmlType="submit" className="form-submit-btn">添加项目并新建influxDB</Button>
	      </Form>
	      <div>{this.state.hash}</div>
	      <div><Button type="primary" onClick={this.gotoMonitor} className="form-submit-btn">跳转到图表界面</Button></div>
    	</div>
    );
  }
}
export default Form.create()(InitProject);
