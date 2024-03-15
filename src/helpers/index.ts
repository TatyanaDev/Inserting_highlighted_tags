import { RefObject } from "react";

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

const onTagSelected = (values: { [key: string]: string | undefined }, customTextArea: RefObject<HTMLDivElement>) => {
  const applyTagToTemplate = (customTextArea: RefObject<HTMLDivElement>, template: string, tag: string) => {
    if (customTextArea.current) {
      customTextArea.current.focus();
      insertHTML(` ${tag} `);
      values[template] = customTextArea.current.innerText;
    }
  };

  const applyCreatedTag = (customTextArea: RefObject<HTMLDivElement>) => (template: string, tag: string) => applyTagToTemplate(customTextArea, template, tag);

  const onTagSelect = applyCreatedTag(customTextArea);

  return onTagSelect;
};

export default onTagSelected;
