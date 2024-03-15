import { Form as AntForm, Dropdown, Menu, Button as AntBtn } from "antd";
import { Form as FinalForm, Field as Fie } from "react-final-form";
import React, { ComponentType, RefObject, useRef } from "react";
import styled from "styled-components";
import DOMPurify from "dompurify";
import cn from "classnames";
import tags from "../../constants";

const Form = ({ children, setRef, render, decorators, onSubmit, className, successMessage, ...rest }: any) => (
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

const onTagSelected = (values: any, customTextAreaForEmail: RefObject<HTMLDivElement>) => {
  const insertHTML = (html: string) => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const insertion = document.createRange().createContextualFragment(html);
    const lastNode = insertion.lastChild; // Get the last node of the inserted fragment

    range.insertNode(insertion);

    // Create a new range for setting the cursor position
    const newRange = document.createRange();

    if (lastNode) {
      // Set the start and end positions of the range to the end of the last node
      newRange.setStartAfter(lastNode);
      newRange.setEndAfter(lastNode);
    } else {
      // If for some reason lastNode is not available, set the range to the original insertion point
      newRange.setStart(range.endContainer, range.endOffset);
      newRange.setEnd(range.endContainer, range.endOffset);
    }

    // Clear existing selections
    selection.removeAllRanges();

    // Add the new range, which moves the cursor to the end of the inserted content
    selection.addRange(newRange);
  };

  const applyTagToTemplate = (customTextArea: RefObject<HTMLDivElement>, template: string, tag: string) => {
    customTextArea.current?.focus();
    insertHTML(` ${tag} `);
    values[template] = customTextArea.current?.innerText;
  };

  const applyCreatedTag = (customTextArea: RefObject<HTMLDivElement>) => (template: string, tag: string) => applyTagToTemplate(customTextArea, template, tag);

  const onTagSelectedForEmail = applyCreatedTag(customTextAreaForEmail);

  return onTagSelectedForEmail;
};

const FormBlock = ({ labelComponent, itemProps, formClassName, component: Component, ...props }: any) => (
  <AntForm.Item label={labelComponent} validateStatus={null ? "error" : undefined} colon={false} className={cn(formClassName || "", itemProps && itemProps.className)}>
    <Component {...props} />
  </AntForm.Item>
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

const withFormBlock = (Component: any, itemProps?: any) => (props: any & { noFormBlock?: boolean }) => <FormBlock component={Component} itemProps={itemProps} {...props} />;

const FormTextAreaWithTags = ({ input, values, customTextArea, placeholder }: any) => {
  const onKeyUp = () => (values[input.name] = customTextArea.current?.innerText);

  return <CustomTextArea id={input.name} contentEditable ref={customTextArea} suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input.value.replace(/\n\r?/g, "<br />")) }} theme={{ placeholder }} onKeyUp={onKeyUp} />;
};

const FormTextAreaWithTagsw = withFormBlock(FormTextAreaWithTags);

const withField =
  <T extends { name: string }>(Component: ComponentType<any>, defaultProps?: any) =>
  (props: T & Omit<any, "meta"> & { [key: string]: any }) =>
    <Fie component={Component} {...defaultProps} {...props} />;

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

const ChannelsBlock = ({ values, onTagSelectedForEmail, customTextAreaForEmail }: any) => {
  const onItemSelect = (key: string) => onTagSelectedForEmail("template", key);

  return (
    <TextAreaWithTags
      name="template"
      placeholder="Write your message"
      customTextArea={customTextAreaForEmail}
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
  const customTextAreaForEmail = useRef(null);

  return (
    <Form>
      {({ values }: any) => {
        const onTagSelectedForEmail = onTagSelected(values, customTextAreaForEmail);

        return <ChannelsBlock values={values} onTagSelectedForEmail={onTagSelectedForEmail} customTextAreaForEmail={customTextAreaForEmail} />;
      }}
    </Form>
  );
}
