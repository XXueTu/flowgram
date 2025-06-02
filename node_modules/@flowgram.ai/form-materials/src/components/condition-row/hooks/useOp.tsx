import React, { useMemo } from 'react';

import { Button, Select } from '@douyinfe/semi-ui';
import { IconChevronDownStroked } from '@douyinfe/semi-icons';

import { IRule, Op } from '../types';
import { opConfigs } from '../constants';

interface HookParams {
  rule?: IRule;
  op?: Op;
  onChange: (op: Op) => void;
}

export function useOp({ rule, op, onChange }: HookParams) {
  const options = useMemo(
    () =>
      Object.keys(rule || {}).map((_op) => ({
        ...(opConfigs[_op as Op] || {}),
        value: _op,
      })),
    [rule]
  );

  const opConfig = useMemo(() => opConfigs[op as Op], [op]);

  const renderOpSelect = () => (
    <Select
      style={{ height: 22 }}
      size="small"
      value={op}
      optionList={options}
      onChange={(v) => {
        onChange(v as Op);
      }}
      triggerRender={({ value }) => (
        <Button size="small" disabled={!rule}>
          {opConfig?.abbreviation || <IconChevronDownStroked size="small" />}
        </Button>
      )}
    />
  );

  return { renderOpSelect, opConfig };
}
