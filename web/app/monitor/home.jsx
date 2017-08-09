import {Component} from 'react';
import './style.css';
import 'antd/dist/antd.css';
import TopMenu from 'monitor/components/top-menu';

export default class extends Component {
  state = {menus: [
    {
      to: '/dashboard',
      label: '监控面板'
    },
    {
      to: '/user',
      label: '用户管理'
    },
    {
      to: '/project',
      label: '项目管理'
    }
  ]};
  render() {
    return (
      <div>
        <div>
        <TopMenu {...this.props} menus={this.state.menus}/>
        </div>
        <div>
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
};