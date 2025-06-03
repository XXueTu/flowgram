import { IconCrossCircleStroked, IconPlus } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { ConditionRow, ConditionRowValueType } from '@flowgram.ai/form-materials';
import { ASTMatch, BaseType, BaseVariableField, Field, FieldArray, useScopeAvailable } from '@flowgram.ai/free-layout-editor';
import { nanoid } from 'nanoid';

import { Feedback, FormItem } from '../../../form-components';
import { useNodeRenderContext } from '../../../hooks';
import { ConditionPort } from './styles';

interface ConditionValue {
  key: string;
  value?: ConditionRowValueType;
}

export function ConditionInputs() {
  const { readonly } = useNodeRenderContext();
  const scopeAvailable = useScopeAvailable();

  const getTypeChildren = (type?: BaseType): BaseVariableField[] => {
    if (!type) return [];

    // get properties of Object
    if (ASTMatch.isObject(type)) return type.properties;

    // get items type of Array
    if (ASTMatch.isArray(type)) return getTypeChildren(type.items);

    return [];
  };

  const renderVariable = (variable: BaseVariableField): BaseVariableField => {
    console.log('variable', variable);
    // debugger
    return {
      title: variable.meta?.title,
      key: variable.key,
      type: variable.type.kind,
      // kind: variable.kind,
      // Only Object Type can drilldown
      children: getTypeChildren(variable.type).map(renderVariable),

    }
  };
  console.log('scopeAvailable', scopeAvailable.variables.map(renderVariable));
  // debugger
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
                        // debugger

                        childField.onChange({ value: v, key: childField.value.key})
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
