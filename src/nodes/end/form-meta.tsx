import { IFlowValue } from '@flowgram.ai/form-materials';
import { Field, FieldRenderProps, FormMeta } from '@flowgram.ai/free-layout-editor';
import { mapValues } from 'lodash-es';

import { FormContent, FormHeader, FormOutputs, PropertiesEdit } from '../../form-components';
import { useIsSidebar } from '../../hooks';
import { JsonSchema } from '../../typings';
import { defaultFormMeta } from '../default-form-meta';

export const renderForm = () => {
  const isSidebar = useIsSidebar();
  if (isSidebar) {
    return (
      <>
        <FormHeader />
        <FormContent>
          <Field
            name="outputs.properties"
            render={({
              field: { value: propertiesSchemaValue, onChange: propertiesSchemaChange },
            }: FieldRenderProps<Record<string, JsonSchema>>) => (
              <Field<Record<string, IFlowValue>> name="inputsValues">
                {({ field: { value: propertiesValue, onChange: propertiesValueChange } }) => {
                  const onChange = (newProperties: Record<string, JsonSchema>) => {
                    const newPropertiesValue = mapValues(newProperties, (v) => v.default);
                    const newPropetiesSchema = mapValues(newProperties, (v) => {
                      delete v.default;
                      return v;
                    });
                    propertiesValueChange(newPropertiesValue);
                    propertiesSchemaChange(newPropetiesSchema);
                  };
                  const value = mapValues(propertiesSchemaValue, (v, key) => ({
                    ...v,
                    default: propertiesValue?.[key],
                  }));
                  return (
                    <>
                      <PropertiesEdit value={value} onChange={onChange} useFx={true} />
                    </>
                  );
                }}
              </Field>
            )}
          />
          <FormOutputs />
        </FormContent>
      </>
    );
  }
  return (
    <>
      <FormHeader />
      <FormContent>
        <FormOutputs />
      </FormContent>
    </>
  );
};

export const formMeta: FormMeta = {
  ...defaultFormMeta,
  render: renderForm,
};
