var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import React, { cloneElement, Children, useMemo, isValidElement } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/lib/es/steps/constants';
import getDataAttr from '@douyinfe/semi-foundation/lib/es/utils/getDataAttr';
import { Row, Col } from '../grid';
const Steps = props => {
  const {
      current,
      status,
      children,
      prefixCls,
      initial,
      direction,
      className,
      style,
      onChange
    } = props,
    rest = __rest(props, ["current", "status", "children", "prefixCls", "initial", "direction", "className", "style", "onChange"]);
  const inner = useMemo(() => {
    const filteredChildren = Children.toArray(children).filter(c => /*#__PURE__*/isValidElement(c));
    const colStyle = direction === 'vertical' ? null : {
      width: `${100 / filteredChildren.length}%`
    };
    const content = Children.map(filteredChildren, (child, index) => {
      if (!child) {
        return null;
      }
      const stepNumber = initial + index;
      const childProps = Object.assign({
        stepNumber: `${stepNumber + 1}`,
        direction
      }, child.props);
      if (status === 'error' && index === current - 1) {
        childProps.className = `${prefixCls}-next-error`;
      }
      if (!child.props.status) {
        if (stepNumber === current) {
          childProps.status = status;
        } else if (stepNumber < current) {
          childProps.status = 'finish';
        } else {
          childProps.status = 'wait';
        }
      }
      childProps.onChange = onChange ? () => {
        if (index !== current) {
          onChange(index + initial);
        }
      } : undefined;
      return /*#__PURE__*/React.createElement(Col, {
        style: colStyle
      }, /*#__PURE__*/cloneElement(child, Object.assign({}, childProps)));
    });
    return content;
  }, [children, initial, prefixCls, direction, status, current, onChange]);
  const wrapperCls = cls(className, {
    [prefixCls]: true,
    [`${prefixCls}-${direction}`]: true
  });
  return /*#__PURE__*/React.createElement("div", Object.assign({
    className: wrapperCls,
    style: style,
    "aria-label": props["aria-label"]
  }, getDataAttr(rest)), /*#__PURE__*/React.createElement(Row, {
    type: "flex",
    justify: "start"
  }, inner));
};
Steps.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  current: PropTypes.number,
  initial: PropTypes.number,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  status: PropTypes.oneOf(['wait', 'process', 'finish', 'error', 'warning'])
};
Steps.defaultProps = {
  prefixCls: css.PREFIX,
  current: 0,
  direction: 'horizontal',
  initial: 0,
  status: 'process'
};
export default Steps;