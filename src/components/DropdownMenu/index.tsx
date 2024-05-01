import React, { ReactNode } from "react";
import { Menu, Button } from "antd";
import cn from "classnames";
import { tags } from "../../constants";

interface DropdownMenuProps {
  onItemSelect: (label: string) => void;
}

interface TagButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const TagButton = ({ children, onClick }: TagButtonProps) => (
  <Button className={cn("ant-btn-base", "upper-case", "tag-button")} onClick={onClick}>
    {children}
  </Button>
);

const DropdownMenu = ({ onItemSelect, ...props }: DropdownMenuProps) => (
  <Menu className="dropdown-menu" {...props}>
    {tags.map(({ label }) => (
      <TagButton key={label} onClick={() => onItemSelect(label)}>
        {label}
      </TagButton>
    ))}
  </Menu>
);

export default DropdownMenu;
