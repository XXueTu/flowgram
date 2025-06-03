import { IconCrossCircleStroked, IconPlus } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { ConditionRow, ConditionRowValueType } from '@flowgram.ai/form-materials';
import { Field, FieldArray } from '@flowgram.ai/free-layout-editor';
import { nanoid } from 'nanoid';

import { Feedback, FormItem } from '../../../form-components';
import { useNodeRenderContext } from '../../../hooks';
import { ConditionPort } from './styles';
import { getTypeByContentPath } from './utils';


interface ConditionValue {
  key: string;
  value?: ConditionRowValueType;
  leftType?: string;
  rightType?: string;
}

export function ConditionInputs() {
  const { readonly,...ctx } = useNodeRenderContext();
  return (
    <FieldArray name="conditions">
      {({ field }) => (
        <>
          {field.map((child, index) => (
            <Field<ConditionValue> key={child.name} name={child.name}>
              {({ field: childField, fieldState: childState }) => (
                <FormItem name="if" type="boolean" required={true} labelWidth={40}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ConditionRow
                      readonly={readonly}
                      style={{ flexGrow: 1 }}
                      value={childField.value.value}
                      onChange={(v) => {
                        const ltp = getTypeByContentPath(ctx, v?.left?.content as string[] || []);
                        const rtp = getTypeByContentPath(ctx, v?.right?.content as string[] || []);
                        childField.onChange({ value: v, key: childField.value.key, leftType:ltp, rightType:rtp})
                      }}
                    />

                    <Button
                      theme="borderless"
                      icon={<IconCrossCircleStroked />}
                      onClick={() => field.delete(index)}
                    />
                  </div>

                  <Feedback errors={childState?.errors} invalid={childState?.invalid} />
                  <ConditionPort data-port-id={childField.value.key} data-port-type="output" />
                </FormItem>
              )}
            </Field>
          ))}
          {!readonly && (
            <div>
              <Button
                theme="borderless"
                icon={<IconPlus />}
                onClick={() =>
                  field.append({
                    key: `if_${nanoid(6)}`,
                    value: { type: 'expression', content: '' },
                  })
                }
              >
                Add
              </Button>
            </div>
          )}
        </>
      )}
    </FieldArray>
  );
}
