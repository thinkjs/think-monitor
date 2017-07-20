import {Component} from 'react';
import TopMenu from 'install/components/top-menu';

export default class extends Component {
  state = {menus: []};
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