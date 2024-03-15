import { Button } from "antd";
import React from "react";

const AddTagButton = ({ ...props }) => (
  <Button {...props} className="add-tag-button">
    Add tag
  </Button>
);

export default AddTagButton;
