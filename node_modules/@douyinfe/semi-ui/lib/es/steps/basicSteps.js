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
const Steps = props => {
  const {
      size,
      current,
      status,
      children,
      prefixCls,
      initial,
      direction,
      className,
      style,
      hasLine,
      onChange
    } = props,
    rest = __rest(props, ["size", "current", "status", "children", "prefixCls", "initial", "direction", "className", "style", "hasLine", "onChange"]);
  const inner = useMemo(() => {
    const filteredChildren = Children.toArray(children).filter(c => /*#__PURE__*/isValidElement(c));
    const content = Children.map(filteredChildren, (child, index) => {
      if (!child) {
        return null;
      }
      const stepNumber = initial + index;
      const childProps = Object.assign({
        stepNumber: `${stepNumber + 1}`,
        size
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
      childProps.active = stepNumber === current;
      childProps.done = stepNumber < current;
      childProps.onChange = onChange ? () => {
        if (index !== current) {
          onChange(index + initial);
        }
      } : undefined;
      return /*#__PURE__*/cloneElement(child, Object.assign({}, childProps));
    });
    return content;
  }, [children, initial, prefixCls, direction, status, current, size, onChange]);
  const wrapperCls = cls(className, {
    [`${prefixCls}-basic`]: true,
    [`${prefixCls}-${direction}`]: true,
    [`${prefixCls}-${size}`]: size !== 'default',
    [`${prefixCls}-hasline`]: hasLine
  });
  return /*#__PURE__*/React.createElement("div", Object.assign({
    "aria-label": props["aria-label"],
    className: wrapperCls,
    style: style
  }, getDataAttr(rest)), inner);
};
Steps.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  current: PropTypes.number,
  initial: PropTypes.number,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  status: PropTypes.oneOf(['wait', 'process', 'finish', 'error', 'warning']),
  hasLine: PropTypes.bool
};
Steps.defaultProps = {
  prefixCls: css.PREFIX,
  current: 0,
  direction: 'horizontal',
  size: '',
  initial: 0,
  hasLine: true,
  status: 'process'
};
export default Steps;