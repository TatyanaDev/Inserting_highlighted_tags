import React, { useRef, useState, useCallback, useEffect } from "react";
import DOMPurify from "dompurify";
import { Dropdown } from "antd";
import TextAreaWithTags from "../../components/TextAreaWithTags";
import DropdownMenu from "../../components/DropdownMenu";
import AddTagButton from "../../components/AddTagButton";
import { tagsValues } from "../../constants";
import onTagSelected from "../../helpers";
import Form from "../../components/Form";

const InsertingTags = () => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const customTextArea = useRef<HTMLDivElement>(null);

  const handleTextAreaChange = useCallback((textAreaValue) => setTextAreaValue(textAreaValue), []);
  
  const pattern = new RegExp(`(${tagsValues.join("|")})(?![A-Z])`, "g");
  const highlightedTextAreaValue = DOMPurify.sanitize(textAreaValue.replace(pattern, "<span>$1</span>").replace(/\n\n\r?/g, "<div><br /></div>"));

  useEffect(() => {
    if (customTextArea.current) {
      const textArea = customTextArea.current;

      const handleInput = () => {
        const textAreaValue = textArea.innerText;

        setTextAreaValue(textAreaValue);
      };

      textArea.addEventListener("input", handleInput);

      return () => {
        if (textArea) {
          textArea.removeEventListener("input", handleInput);
        }
      };
    }
  }, [customTextArea]);

  return (
    <Form>
      {({ form }) => {
        const values = form.getState().values;
        const onTagSelect = onTagSelected(values, customTextArea, handleTextAreaChange);
        const onItemSelect = (key: string) => onTagSelect("template", key);

        return (
          <>
            <div suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: highlightedTextAreaValue }} className="highlighted-tags" />

            <TextAreaWithTags
              name="template"
              customTextArea={customTextArea}
              values={values}
              handleTextAreaChange={handleTextAreaChange}
              labelComponent={
                <Dropdown placement="topLeft" overlay={<DropdownMenu onItemSelect={onItemSelect} />}>
                  <AddTagButton />
                </Dropdown>
              }
            />
          </>
        );
      }}
    </Form>
  );
};

export default InsertingTags;
