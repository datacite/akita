// Referenced from
// https://stackoverflow.com/questions/72306064/is-there-any-way-to-fix-errors-caused-by-bootstrap-when-upgrading-to-react-18


import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class PortalWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.tooltipRoot = document.getElementById('tooltip-root');
  }

  componentDidMount() {
    this.tooltipRoot?.appendChild(this.el);
  }

  componentWillUnmount() {
    this.tooltipRoot?.removeChild(this.el);
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

PortalWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default PortalWrapper;