import { Field } from '@flowgram.ai/free-layout-editor';

import { useNodeRenderContext } from '../../hooks';
import { JsonSchema } from '../../typings';
import { TypeTag } from '../type-tag';
import { FormInputItem, FormInputsContainer } from './styles';

export function FormInputs() {
  const { readonly } = useNodeRenderContext();
  return (
    <Field<JsonSchema> name="inputs">
      {({ field: inputsField }) => {
        const required = inputsField.value?.required || [];
        const properties = inputsField.value?.properties;
        if (!properties) {
          return <></>;
        }
        const content = Object.keys(properties).map((key) => {
          const property = properties[key];
          return (
            <FormInputItem key={key}>
              <TypeTag type={property.type as string} />
              <span>{key}</span>
              {required.includes(key) && <span style={{ color: '#f93920' }}>*</span>}
            </FormInputItem>
          );
        });
        return <FormInputsContainer>{content}</FormInputsContainer>;
      }}
    </Field>
  );
}
