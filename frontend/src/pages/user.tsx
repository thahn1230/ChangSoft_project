import React, { useState } from 'react';
import { Form, Field } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';

interface UserData {
  userId: string;
  password: string;
  userName: string;
  email: string;
  phoneNumber: string;
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    userId: '',
    password: '',
    userName: '',
    email: '',
    phoneNumber: ''
  });

  const handleSubmit = (values: { [name: string]: any }, event?: React.SyntheticEvent<any, Event>) => {
    // 서버로 사용자 정보를 저장하는 로직을 구현하세요.
    console.log('Submitted data:', values);
  };

  return (
    <div>
      <h2>User Page</h2>
      <Form
        onSubmit={handleSubmit}
        initialValues={userData}
        render={(formRenderProps) => (
          <form onSubmit={formRenderProps.onSubmit}>
            <div>
              <Field name="userId" label="User ID" component={Input} />
            </div>
            <div>
              <Field name="password" label="User Password" component={Input} type="password" />
            </div>
            <div>
              <Field name="userName" label="User Name" component={Input} />
            </div>
            <div>
              <Field name="email" label="Email" component={Input} type="email" />
            </div>
            <div>
              <Field name="phoneNumber" label="Phone Number" component={Input} />
            </div>
            <div>
              <button type="submit" disabled={!formRenderProps.allowSubmit}>
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
