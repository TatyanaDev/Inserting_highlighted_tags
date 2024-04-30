import React, { useRef } from "react";
import { Dropdown } from "antd";
import TextAreaWithTags from "../../components/TextAreaWithTags";
import DropdownMenu from "../../components/DropdownMenu";
import AddTagButton from "../../components/AddTagButton";
import onTagSelected from "../../helpers";
import Form from "../../components/Form";

const InsertingTags = () => {
  const customTextArea = useRef<HTMLDivElement>(null);

  return (
    <Form>
      {({ form }) => {
        const values = form.getState().values;
        const onTagSelect = onTagSelected(values, customTextArea);
        const onItemSelect = (key: string) => onTagSelect("template", key);

        return (
          <TextAreaWithTags
            name="template"
            customTextArea={customTextArea}
            values={values}
            labelComponent={
              <Dropdown placement="topLeft" overlay={<DropdownMenu onItemSelect={onItemSelect} />}>
                <AddTagButton />
              </Dropdown>
            }
          />
        );
      }}
    </Form>
  );
};

export default InsertingTags;
