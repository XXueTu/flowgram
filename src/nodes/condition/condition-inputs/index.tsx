import { IconCrossCircleStroked, IconPlus } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { ConditionRow, ConditionRowValueType } from '@flowgram.ai/form-materials';
import { Field, FieldArray, useScopeAvailable } from '@flowgram.ai/free-layout-editor';
import { nanoid } from 'nanoid';

import { JsonSchemaUtils } from '@flowgram.ai/form-materials';
import { Feedback, FormItem } from '../../../form-components';
import { useNodeRenderContext } from '../../../hooks';
import { ConditionPort } from './styles';


interface ConditionValue {
  key: string;
  value?: ConditionRowValueType;
  leftType?: string;
  rightType?: string;
}

export function ConditionInputs() {
  const { readonly } = useNodeRenderContext();
  const available = useScopeAvailable();
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
                        var ltp: any
                        var rtp: any
                        const ltpVariable = available.getByKeyPath(v?.left?.content as string[]);
                        const rtpVariable = available.getByKeyPath(v?.right?.content as string[]);
                        if (!ltpVariable){
                          ltp = "undefined"
                        }else{
                          ltp = JsonSchemaUtils.astToSchema(ltpVariable.type, { drilldown: false })?.type;
                        }
                        if (!rtpVariable){
                          rtp = "undefined"
                        }else{
                          rtp = JsonSchemaUtils.astToSchema(rtpVariable.type, { drilldown: false })?.type;
                        }
                    
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
