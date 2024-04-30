import { Form as FinalForm, FormRenderProps } from "react-final-form";
import React, { FC, ReactNode } from "react";
import { Form as AntdForm } from "antd";

interface FormProps {
  children: (props: FormRenderProps) => ReactNode;
}

const Form: FC<FormProps> = ({ children }) => (
  <FinalForm validateOnBlur={false} onSubmit={() => {}}>
    {(props) => <AntdForm>{children(props)}</AntdForm>}
  </FinalForm>
);

export default Form;
