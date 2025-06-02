import React, { useEffect, useState } from 'react';

import Input, { InputProps } from '@douyinfe/semi-ui/lib/es/input';

export function BlurInput(props: InputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(props.value as string);
  }, [props.value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(value) => {
        setValue(value);
      }}
      onBlur={(e) => props.onChange?.(value, e)}
    />
  );
}
