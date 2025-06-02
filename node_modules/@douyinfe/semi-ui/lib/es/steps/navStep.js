import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/lib/es/steps/constants';
import { IconChevronRight } from '@douyinfe/semi-icons';
const NavStep = props => {
  const {
    prefixCls,
    className,
    title,
    style,
    active,
    index,
    total,
    onClick,
    onKeyDown,
    onChange
  } = props;
  const classString = classnames(prefixCls, {
    [`${prefixCls}-active`]: active
  }, className);
  const handleClick = e => {
    onClick === null || onClick === void 0 ? void 0 : onClick(e);
    onChange === null || onChange === void 0 ? void 0 : onChange();
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
      onChange === null || onChange === void 0 ? void 0 : onChange();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    role: props["role"],
    "aria-label": props["aria-label"],
    "aria-current": "step",
    tabIndex: 0,
    className: classString,
    style: style,
    onClick: e => handleClick(e),
    onKeyDown: handleKeyDown
  }, /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-container`
  }, /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-content`
  }, /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-title`
  }, title)), index !== total - 1 && (/*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-icon`
  }, /*#__PURE__*/React.createElement(IconChevronRight, {
    size: "small"
  })))));
};
NavStep.propTypes = {
  prefixCls: PropTypes.string,
  title: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  active: PropTypes.bool
};
NavStep.defaultProps = {
  prefixCls: css.ITEM,
  active: false,
  className: ''
};
export default NavStep;