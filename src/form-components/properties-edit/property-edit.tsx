import React, { useLayoutEffect, useState } from 'react';

import { IconCrossCircleStroked, IconExpand, IconShrink } from '@douyinfe/semi-icons';
import { Button, IconButton, Input } from '@douyinfe/semi-ui';
import { DynamicValueInput, TypeSelector } from '@flowgram.ai/form-materials';

import { JsonSchema } from '../../typings';
import { ExpandDetail, Label, LeftColumn, Row } from './styles';

export interface PropertyEditProps {
  propertyKey: string;
  value: JsonSchema;
  useFx?: boolean;
  disabled?: boolean;
  onChange: (value: JsonSchema, propertyKey: string, newPropertyKey?: string) => void;
  onDelete?: () => void;
}

export const PropertyEdit: React.FC<PropertyEditProps> = (props) => {
  const { value, disabled } = props;
  const [inputKey, updateKey] = useState(props.propertyKey);
  const [expand, setExpand] = useState(false);
  
  const updateProperty = (key: keyof JsonSchema, val: any) => {
    value[key] = val;
    props.onChange(value, props.propertyKey);
  };

  const partialUpdateProperty = (val?: Partial<JsonSchema>) => {
    props.onChange({ ...value, ...val }, props.propertyKey);
  };

  useLayoutEffect(() => {
    updateKey(props.propertyKey);
  }, [props.propertyKey]);

  return (
    <>
      <Row>
        <LeftColumn>
          <TypeSelector
            value={value}
            disabled={disabled}
            style={{ position: 'absolute', top: 2, left: 4, zIndex: 1, padding: '0 5px', height: 20 }}
            onChange={(val) => partialUpdateProperty(val)}
          />
          <Input
            value={inputKey}
            disabled={disabled}
            size="small"
            onChange={(v) => updateKey(v.trim())}
            onBlur={() => {
              if (inputKey !== '') {
                props.onChange(value, props.propertyKey, inputKey);
              } else {
                updateKey(props.propertyKey);
              }
            }}
            style={{ paddingLeft: 26 }}
          />
        </LeftColumn>
        <DynamicValueInput
          value={value.default}
          onChange={(val) => updateProperty('default', val)}
          schema={{...value, extra: { weak: true }}}
          style={{ flexGrow: 1 }}
        />
        {!disabled && (
          <IconButton
            style={{ marginLeft: 5, position: 'relative', top: 2 }}
            size="small"
            theme="borderless"
            icon={expand ? <IconShrink size="small" /> : <IconExpand size="small" />}
            onClick={() => setExpand(!expand)}
          />
        )}
        {props.onDelete && !disabled && (
          <Button
            style={{ marginLeft: 5, position: 'relative', top: 2 }}
            size="small"
            theme="borderless"
            icon={<IconCrossCircleStroked />}
            onClick={props.onDelete}
          />
        )}
      </Row>
      {expand && (
        <ExpandDetail>
          <Label>describe</Label>
          <Input
            size="small"
            value={value.description || ''}
            onChange={(description) => updateProperty('description', description)}
            placeholder="输入字段描述,帮助用户理解该字段的用途"
            style={{ flex: 1 }}
          />
        </ExpandDetail>
      )}
    </>
  );
};