import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { Input, Button } from 'antd';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Window = styled.div`
  width: 80%;
  height: 60%;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  box-shadow: ${(props) => props.theme.boxShadow.normal};
`;

interface Values {
  username: string;
  password: string;
}

class Login extends React.Component {
  render() {
    return (
      <Container>
        <Window>
          <Formik<Values>
            initialValues={{ username: '', password: '' }}
            onSubmit={(values) => console.log(values)}
          >
            {({ values, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Input
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                />
                <Input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                />
                <Button onClick={() => handleSubmit()}>提交</Button>
              </form>
            )}
          </Formik>
        </Window>
      </Container>
    );
  }
}

export default Login;
