import { Form as AntdForm, Dropdown, Menu, Button as AntBtn } from "antd";
import { Form as FinalForm, Field } from "react-final-form";
import React, { ComponentType, useRef } from "react";
import styled from "styled-components";
import DOMPurify from "dompurify";
import cn from "classnames";
import onTagSelected from "../../helpers";
import tags from "../../constants";

const Form = ({ children, setRef, render }: any) => (
  <FinalForm ref={setRef} validateOnBlur={false} onSubmit={() => {}}>
    {(props) => (
      <AntdForm onSubmit={props.handleSubmit}>
        {(render || children)({
          ...props,
        })}
      </AntdForm>
    )}
  </FinalForm>
);

const FormBlock = ({ labelComponent, component: Component, ...props }: any) => (
  <AntdForm.Item label={labelComponent} colon={false}>
    <Component {...props} />
  </AntdForm.Item>
);

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

const withFormBlock = (Component: ComponentType) => (props: any) => <FormBlock component={Component} {...props} />;

const FormTextAreaWithTags = ({ input, values, customTextArea, placeholder }: any) => {
  const onKeyUp = () => {
    if (customTextArea.current) {
      values[input.name] = customTextArea.current.innerText;
    }
  };

  return <CustomTextArea id={input.name} contentEditable ref={customTextArea} suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input.value.replace(/\n\r?/g, "<br />")) }} theme={{ placeholder }} onKeyUp={onKeyUp} />;
};

const FormTextAreaWithTagsw = withFormBlock(FormTextAreaWithTags);

const withField = (Component: ComponentType, defaultProps?: any) => (props: { name: string } & { [key: string]: any }) => <Field component={Component} {...defaultProps} {...props} />;

function Button({ upperCase = true, children, className, type, onClick }: any) {
  const isBase = !type || type === "default";

  const resultClassName = cn(
    {
      "ant-btn-base": isBase,
      "upper-case": upperCase,
    },
    className
  );

  return (
    <AntBtn className={resultClassName} onClick={onClick}>
      {children}
    </AntBtn>
  );
}

function Button2({ minorBtn, className, smallRadius, type, ...props }: any) {
  const isBase = !type || type === "default";

  const resultClassName = cn(
    {
      "ant-btn-base": isBase,
      "ant-btn-minor": minorBtn,
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

const DropdownMenu = ({ onItemSelect, ...props }: any) => (
  <Menu className="app-common-dropdown-with-buttons" {...props}>
    {tags.map(({ label }) => (
      <Button key={label} onClick={() => onItemSelect(label)}>
        {label}
      </Button>
    ))}
  </Menu>
);

const TextAreaWithTags = withField(FormTextAreaWithTagsw);

const ChannelsBlock = ({ values, onTagSelect, customTextArea }: any) => {
  const onItemSelect = (key: string) => onTagSelect("template", key);

  return (
    <TextAreaWithTags
      name="template"
      placeholder="Write your message"
      customTextArea={customTextArea}
      values={values}
      labelComponent={
        <Dropdown placement="topCenter" overlay={<DropdownMenu onItemSelect={onItemSelect} />}>
          <TagButton smallRadius minorBtn ghost />
        </Dropdown>
      }
    />
  );
};

export default function InsertingTags() {
  const customTextArea = useRef(null);

  return (
    <Form>
      {({ values }: any) => {
        const onTagSelect = onTagSelected(values, customTextArea);

        return <ChannelsBlock values={values} onTagSelect={onTagSelect} customTextArea={customTextArea} />;
      }}
    </Form>
  );
}
