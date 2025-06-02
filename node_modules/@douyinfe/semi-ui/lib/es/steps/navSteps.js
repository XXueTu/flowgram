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
import getDataAttr from '@douyinfe/semi-foundation/lib/es/utils/getDataAttr';
import cls from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/lib/es/steps/constants';
const Steps = props => {
  const {
      size,
      current,
      initial,
      children,
      prefixCls,
      className,
      style,
      onChange
    } = props,
    rest = __rest(props, ["size", "current", "initial", "children", "prefixCls", "className", "style", "onChange"]);
  const inner = useMemo(() => {
    const filteredChildren = Children.toArray(children).filter(c => /*#__PURE__*/isValidElement(c));
    const total = filteredChildren.length;
    const content = Children.map(filteredChildren, (child, index) => {
      if (!child) {
        return null;
      }
      const childProps = Object.assign({
        index,
        total
      }, child.props);
      childProps.active = index === current;
      childProps.onChange = onChange ? () => {
        if (index !== current) {
          onChange(index + initial);
        }
      } : undefined;
      return /*#__PURE__*/cloneElement(child, Object.assign({}, childProps));
    });
    return content;
  }, [children, prefixCls, current, size, initial, onChange]);
  const wrapperCls = cls(className, {
    [`${prefixCls}-nav`]: true,
    [`${prefixCls}-${size}`]: size !== 'default'
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
  size: PropTypes.oneOf(['small', 'default'])
};
Steps.defaultProps = {
  prefixCls: css.PREFIX,
  current: 0,
  direction: 'horizontal',
  size: 'default',
  initial: 0,
  status: 'process'
};
export default Steps;