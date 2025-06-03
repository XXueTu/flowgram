import { Input } from '@douyinfe/semi-ui';
import { JsonSchemaEditor } from '@flowgram.ai/form-materials';
import {
    Field,
    FieldRenderProps,
    FormMeta,
    FormRenderProps,
    ValidateTrigger,
} from '@flowgram.ai/free-layout-editor';

import { FormContent, FormHeader, FormItem, FormOutputs } from '../../form-components';
import { useIsSidebar } from '../../hooks';
import { FlowNodeJSON, JsonSchema } from '../../typings';

export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => {
    const isSidebar = useIsSidebar();
    if (isSidebar) {
        return (
            <>
                <FormHeader />
                <FormContent>
                    <Field
                        name="ccc1"
                    >
                        {({ field }) => (
                            <FormItem name="ccc1" type="string">
                                <Input />
                            </FormItem>
                        )}
                    </Field>
                    <Field
                        name="xxx1"
                        render={({ field: { value, onChange } }: FieldRenderProps<JsonSchema>) => (
                            <FormItem  name="xxx1" type="object">
                                <JsonSchemaEditor
                                    value={value}
                                    onChange={(value) => onChange(value as JsonSchema)}
                                />
                            </FormItem>
                        )}
                    />
                    <Field
                        name="ccc2"
                    >
                        {({ field }) => (
                            <FormItem name="ccc2" type="string">
                                <Input />
                            </FormItem>
                        )}
                    </Field>
                </FormContent>
            </>
        );
    }
    return (
        <>
            <FormHeader />
            <FormContent>
                <FormOutputs name="xxx1" />
            </FormContent>
        </>
    );
};

export const formMeta: FormMeta<FlowNodeJSON> = {
    render: renderForm,
    validateTrigger: ValidateTrigger.onChange,
    validate: {
        title: ({ value }: { value: string }) => (value ? undefined : 'Title is required'),
    },
}; 