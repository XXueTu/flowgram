import { Field } from "@flowgram.ai/free-layout-editor";

import { useIsSidebar } from "../../hooks";
import { JsonSchema } from "../../typings";
import { TypeTag } from "../type-tag";
import { FormOutputsContainer } from "./styles";

export function FormOutputs({ name = "outputs" }: { name?: string }) {
  const isSidebar = useIsSidebar();
  if (isSidebar) {
    return null;
  }
  return (
    <Field<JsonSchema> name={name}>
      {({ field }) => {
        const properties = field.value?.properties;
        if (properties) {
          const content = Object.keys(properties).map((key) => {
            const property = properties[key];
            return <TypeTag key={key} name={key} type={property.type as string} />;
          });
          return <FormOutputsContainer>{content}</FormOutputsContainer>;
        }
        return <></>;
      }}
    </Field>
  );
}
