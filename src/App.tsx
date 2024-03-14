import React, { RefObject, useRef, useState } from "react";
import { Form as FinalForm, Field as Fie } from "react-final-form";
import { Form as AntForm, Col, Dropdown, Menu, Button as AntBtn } from "antd";
import cn from "classnames";
import { omit, pick } from "lodash";
import styled from "styled-components";
import DOMPurify from "dompurify";

const Form = ({ children, setRef, render, decorators, onSubmit, className, successMessage, ...rest }: any) => {
  return (
    <FinalForm {...rest} ref={setRef} validateOnBlur={false} decorators={decorators} onSubmit={() => {}} className={className}>
      {(props: any) => (
        <AntForm onSubmit={props.handleSubmit}>
          {(render || children)({
            ...props,
          })}
        </AntForm>
      )}
    </FinalForm>
  );
};

const onTagSelected = (values: any, setRerender: (value: number) => void, customTextAreaForEmail: RefObject<HTMLDivElement>) => {
  const insertHTML = (html: string) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const insertion = document.createRange().createContextualFragment(html);

    range?.deleteContents();
    range?.insertNode(insertion);
  };

  const applyTagToTemplate = (customTextArea: RefObject<HTMLDivElement>, template: string, tag: string) => {
    customTextArea.current?.focus();
    insertHTML(` ${tag} `);
    values[template] = customTextArea.current?.innerText;
    setRerender(Date.now());
  };

  const applyCreatedTag = (customTextArea: RefObject<HTMLDivElement>) => (template: string, tag: string) => applyTagToTemplate(customTextArea, template, tag);

  const onTagSelectedForEmail = applyCreatedTag(customTextAreaForEmail);

  return {
    onTagSelectedForEmail,
  };
};

const FormBlock = ({ submitting, meta, label, labelComponent, tooltip, itemProps, formClassName, component: Component, noLabelHolder, explanation, inputError, ...props }: any) => {
  return (
    <Col {...pick(props, ["span", "order", "offset", "push", "pull", "xs", "sm", "md", "lg", "xl", "xxl", "noLabelHolder"])}>
      <AntForm.Item label={labelComponent} validateStatus={null ? "error" : undefined} colon={false} className={cn(formClassName || "", itemProps && itemProps.className)}>
        <Component {...omit(props, ["span", "order", "offset", "push", "pull", "xs", "sm", "md", "lg", "xl", "xxl", "noLabelHolder"])} />
      </AntForm.Item>
    </Col>
  );
};

const CustomTextArea = styled.div`
  border: 1px solid #adb6cc;
  border-radius: 20px;
  color: #213e76;
  margin-bottom: 8px;
  padding: 4px 11px;
  outline: none;
  transition: all 0.3s;
  overflow: auto;
  :empty:before {
    content: "${({ theme }) => `${theme.placeholder}`}";
    color: #adb6cc;
  }
  :hover {
    border: 1px solid #213e76;
  }
  :focus {
    border: 1px solid rgb(110, 223, 235);
  }
`;

function withFormBlock<T = any>(Component: any, itemProps?: any) {
  return (props: any & T & { noFormBlock?: boolean }) => <FormBlock component={Component} itemProps={itemProps} {...props} />;
}

const FormTextAreaWithTags = ({ input, values, customTextArea, setRerender, placeholder, contentEditable = true }: any) => {
  const onKeyUp = () => {
    values[input.name] = customTextArea.current?.innerText;
    setRerender(Date.now());
  };

  return <CustomTextArea id={input.name} contentEditable ref={customTextArea} suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input.value.replace(/\n\r?/g, "<br />")) }} theme={{ placeholder, contentEditable }} onKeyUp={onKeyUp} />;
};

const FormTextAreaWithTagsw = withFormBlock<any>(FormTextAreaWithTags);

const withField =
  <T extends { name: string }>(Component: React.ComponentType<any>, defaultProps?: any) =>
  (props: T & Omit<any, "meta"> & { [key: string]: any }) =>
    <Fie component={Component} {...defaultProps} {...props} />;

const tags = [
  { label: "CLIENT_FIRST_NAME", value: "CLIENT_FIRST_NAME" },
  { label: "CLIENT_LAST_NAME", value: "CLIENT_LAST_NAME" },
  { label: "STAFF_FIRST_NAME", value: "STAFF_FIRST_NAME" },
  { label: "STAFF_LAST_NAME", value: "STAFF_LAST_NAME" },
  { label: "BOOKING_DATE_TIME", value: "BOOKING_DATE_TIME" },
  { label: "BOOKING_DATE", value: "BOOKING_DATE" },
  { label: "BOOKING_TIME", value: "BOOKING_TIME" },
  { label: "SERVICE_NAME", value: "SERVICE_NAME" },
  { label: "BUSINESS_NAME", value: "BUSINESS_NAME" },
  { label: "BUSINESS_PHONE", value: "BUSINESS_PHONE" },
  { label: "BUSINESS_ADDRESS", value: "BUSINESS_ADDRESS" },
  { label: "BUSINESS_EMAIL", value: "BUSINESS_EMAIL" },
  { label: "LOCATION_NAME", value: "LOCATION_NAME" },
  { label: "LOCATION_PHONE", value: "LOCATION_PHONE" },
  { label: "LOCATION_ADDRESS", value: "LOCATION_ADDRESS" },
  { label: "LOCATION_EMAIL", value: "LOCATION_EMAIL" },
];

function Button({ label, bold = false, semiBold = false, upperCase = true, children, minorBtn, whiteBtn, lightBtn, outlineBtn, dangerTextBtn, className, supportBtn, smallRadius, ...props }: any) {
  const isBase = !props.type || props.type === "default";
  const resultClassName = cn(
    {
      "ant-btn-base": isBase,
      "ant-btn-minor": minorBtn,
      "ant-btn-white": whiteBtn,
      "ant-btn-outline": outlineBtn,
      "ant-btn-light": lightBtn,
      "ant-btn-danger-text": dangerTextBtn,
      bold,
      "semi-bold": semiBold,
      "upper-case": upperCase,
      "ant-btn-support": supportBtn,
      "ant-btn-radius": smallRadius,
    },
    className
  );
  return (
    <AntBtn {...props} className={resultClassName}>
      {children}
    </AntBtn>
  );
}

function Button2({ label, bold = false, semiBold = false, upperCase = true, children, minorBtn, whiteBtn, lightBtn, outlineBtn, dangerTextBtn, className, supportBtn, smallRadius, ...props }: any) {
  const isBase = !props.type || props.type === "default";
  const resultClassName = cn(
    {
      "ant-btn-base": isBase,
      "ant-btn-minor": minorBtn,
      "ant-btn-white": whiteBtn,
      "ant-btn-outline": outlineBtn,
      "ant-btn-light": lightBtn,
      "ant-btn-danger-text": dangerTextBtn,
      bold,
      "semi-bold": semiBold,
      "upper-case": upperCase,
      "ant-btn-support": supportBtn,
      "ant-btn-radius": smallRadius,
    },
    className
  );
  return (
    <AntBtn {...props} className={resultClassName}>
      Add tag
    </AntBtn>
  );
}

const TagButton = styled(Button2)`
  padding: 3px 11px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  height: auto;
  border: 2px solid #14316d;
  border-color: #14316d !important;
  color: #14316d !important;
`;

function DropdownMenu({ options, onItemSelect, ...props }: any) {
  return (
    <Menu className="app-common-dropdown-with-buttons" {...props}>
      {options.map(({ label }: any) => (
        <Button key={label} onClick={() => onItemSelect(label)}>
          {label}
        </Button>
      ))}
    </Menu>
  );
}

class Fields {
  static TextAreaWithTags = withField(FormTextAreaWithTagsw);
}

function ChannelsBlock({ values, onTagSelectedForEmail, customTextAreaForEmail, setRerender }: any) {
  const onItemSelect = (key: string) => onTagSelectedForEmail("emailTemplate", key);

  return (
    <Fields.TextAreaWithTags
      name="emailTemplate"
      placeholder="Email template"
      customTextArea={customTextAreaForEmail}
      values={values}
      labelComponent={
        <div style={{ display: "inline-block", overflow: "visible" }}>
          <Dropdown placement="topCenter" overlay={<DropdownMenu options={tags} onItemSelect={onItemSelect} />}>
            <TagButton label="button.reminder.addTag" smallRadius minorBtn ghost upperCase={false} />
          </Dropdown>
        </div>
      }
      onClickSendTestMessage={() => {}}
      setRerender={setRerender}
    />
  );
}

function SetupForm() {
  const [, setRerender] = useState(Date.now());

  const customTextAreaForEmail = useRef(null);

  return (
    <Form>
      {({ values }: any) => {
        const { onTagSelectedForEmail } = onTagSelected(values, setRerender, customTextAreaForEmail);

        return <ChannelsBlock values={values} onTagSelectedForEmail={onTagSelectedForEmail} customTextAreaForEmail={customTextAreaForEmail} setRerender={setRerender} />;
      }}
    </Form>
  );
}

function App() {
  return <SetupForm />;
}

export default App;
