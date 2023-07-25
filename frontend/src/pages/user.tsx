import React, { useState, useContext } from "react";
import { Form, Field } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { UserInfoI } from "../interface/userInfo_interface";
import { useUserContext } from "./../UserInfoContext";

const UserPage: React.FC = (props: any) => {
  const userInfo = useUserContext();

  const handleSubmit = (
    values: { [name: string]: any },
    event?: React.SyntheticEvent<any, Event>
  ) => {
  };

  return (
      <div>
        <h2>User Page</h2>
        <Form
          onSubmit={handleSubmit}
          // initialValues={userData}
          render={(formRenderProps) => (
            <form onSubmit={formRenderProps.onSubmit}>
              <div>
                <Field name="userId" label="User ID" component={Input} />
              </div>
              <div>
                <Field
                  name="password"
                  label="User Password"
                  component={Input}
                  type="password"
                />
              </div>
              <div>
                <Field name="userName" label="User Name" component={Input} />
              </div>
              <div>
                <Field
                  name="email"
                  label="Email"
                  component={Input}
                  type="email"
                />
              </div>
              <div>
                <Field
                  name="phoneNumber"
                  label="Phone Number"
                  component={Input}
                />
              </div>
              <div>
                {/* <button type="submit" disabled={!formRenderProps.allowSubmit}> */}
                <button type="submit">
                  Save
                </button>
              </div>
            </form>
          )}
        />
      </div>
  );
};

export default UserPage;
