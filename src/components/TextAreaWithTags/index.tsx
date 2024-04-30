import React, { ComponentType, FC, ReactElement, ReactNode, RefObject } from "react";
import { Field, FieldRenderProps } from "react-final-form";
import { Form as AntdForm } from "antd";
import DOMPurify from "dompurify";

interface FormBlockProps<T> {
  labelComponent: ReactNode;
  component: ComponentType<T>;
  props: T;
}

interface FormTextAreaWithTagsProps {
  input: {
    name: string;
    value: string;
  };
  values: Record<string, string>;
  customTextArea: RefObject<HTMLDivElement>;
}

const FormTextAreaWithTags: FC<FormTextAreaWithTagsProps> = ({ input, values, customTextArea }) => {
  const onKeyUp = () => {
    if (customTextArea.current) {
      values[input.name] = customTextArea.current.innerText;
    }
  };

  return <div id={input.name} contentEditable ref={customTextArea} suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input.value.replace(/\n\r?/g, "<br />")) }} onKeyUp={onKeyUp} className="custom-text-area" />;
};

const FormBlock = <T extends {}>({ labelComponent, component: Component, ...props }: FormBlockProps<T>): ReactElement => (
  <AntdForm.Item label={labelComponent} colon={false}>
    {/* @ts-expect-error */}
    <Component {...props} />
  </AntdForm.Item>
);

const withFormBlock =
  <P extends {}>(Component: ComponentType<P>) =>
  (props: any) =>
    <FormBlock component={Component} {...props} />;

const withField =
  <P extends FieldRenderProps<any, HTMLElement, any>>(Component: ComponentType<P>, defaultProps?: Record<string, string>) =>
  (props: any) =>
    <Field component={Component} {...defaultProps} {...props} />;

const TextAreaWithTags = withField(withFormBlock(FormTextAreaWithTags));

export default TextAreaWithTags;
