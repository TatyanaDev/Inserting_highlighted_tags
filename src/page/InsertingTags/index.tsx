import { Form as FinalForm, Field, FormRenderProps } from "react-final-form";
import React, { ComponentType, ReactNode, useRef } from "react";
import { Form as AntdForm, Dropdown } from "antd";
import DOMPurify from "dompurify";
import DropdownMenu from "../../components/DropdownMenu";
import AddTagButton from "../../components/AddTagButton";
import onTagSelected from "../../helpers";

const FormBlock = ({ labelComponent, component: Component, ...props }: any) => (
  <AntdForm.Item label={labelComponent} colon={false}>
    <Component {...props} />
  </AntdForm.Item>
);

const withFormBlock = (Component: ComponentType) => (props: any) => <FormBlock component={Component} {...props} />;

const FormTextAreaWithTags = ({ input, values, customTextArea }: any) => {
  const onKeyUp = () => {
    if (customTextArea.current) {
      values[input.name] = customTextArea.current.innerText;
    }
  };

  return <div id={input.name} contentEditable ref={customTextArea} suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input.value.replace(/\n\r?/g, "<br />")) }} onKeyUp={onKeyUp} className="custom-text-area" />;
};

const FormTextAreaWithTagsw = withFormBlock(FormTextAreaWithTags);

const withField = (Component: ComponentType, defaultProps?: any) => (props: { name: string } & { [key: string]: any }) => <Field component={Component} {...defaultProps} {...props} />;

const TextAreaWithTags = withField(FormTextAreaWithTagsw);

const Form = ({ children }: { children: (props: FormRenderProps) => ReactNode }) => (
  <FinalForm validateOnBlur={false} onSubmit={() => {}}>
    {(props) => (
      <AntdForm>
        {children({
          ...props,
        })}
      </AntdForm>
    )}
  </FinalForm>
);

export default function InsertingTags() {
  const customTextArea = useRef(null);

  return (
    <Form>
      {({ values }: any) => {
        const onTagSelect = onTagSelected(values, customTextArea);
        const onItemSelect = (key: string) => onTagSelect("template", key);

        return (
          <TextAreaWithTags
            name="template"
            customTextArea={customTextArea}
            values={values}
            labelComponent={
              <Dropdown placement="topCenter" overlay={<DropdownMenu onItemSelect={onItemSelect} />}>
                <AddTagButton />
              </Dropdown>
            }
          />
        );
      }}
    </Form>
  );
}
