import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const RowLabel = styled.label`
display: block;
font-weight: bold;
`;

const RowInput = styled.input`
display: block;
width: 100%;
margin: 5px 0;
line-height: 30px;
`;

const ErrorInfo = styled.span`
  color: red;
`;

const RowContainer = styled.div`
  margin: 0 0 10px 0;
`;

function InputRow(props) {
  const {name, validate} = props;
  const [value, setValue] = useState(props.value);

  const handleChange = (event) => {
    let newValue = '';
    if (event.target.getAttribute('type') === 'checkbox') {
      newValue = event.target.checked;
    } else {
      newValue = event.target.value;
    }
    
    setValue(newValue);
    props.onChange(event.target.name, newValue, validate);
  };

  let row;

  if (props.type === 'checkbox') {
    row = (
      <div>
        <input type={props.type} name={name} id={name} value={value} onChange={handleChange} />
        <label htmlFor={name}>{props.labelText}</label>
      </div>
    );
  } else {
    row = (
      <div>
        <RowLabel htmlFor={name}>{props.labelText}</RowLabel>
        <RowInput type={props.type} name={name} id={name} value={value} onChange={handleChange} />
      </div>
    );
  }

  return (
    <RowContainer>
      {row}
      {props.error && props.error.length > 0 ? <ErrorInfo>{props.error}</ErrorInfo> : ''}
    </RowContainer>
  );
}

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    padding: 0 10px;

    @media only screen and (min-width: 600px) {
      padding: 0px;
    }
  `;

  const LoginInnerContainer = styled.div`
    width: 100%;
    margin: 20px auto 0 auto;
    background: #ffffff;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
    padding: 40px 20px 30px 20px;
    border-radius: 15px;
    transition: all .3s;

    @media only screen and (min-width: 600px) {
      width: 450px;
      padding: 40px 55px 45px 55px;
    }
  `;

  const LoginFormFields = styled.fieldset`
    margin: 0;
    padding: 0;
    border: none;
    font-size: 1 em;
  `;

  const SubmitButton = styled.input`
    width: 100%;
    margin: 20px 0 0 0;
    padding: 10px;
    border-radius: 5px;
    background: #0e87f8;
    border: none;
    color: white;
    font-size: 1em;
  `;

  const Header = styled.h1`
    text-align: center;
    margin: 0 0 20px 0;
  `;

function LoginForm() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
    errors: {
      email: '',
      password: ''
    },
  });

  const [response, setResponse] = useState(null);

  const validateForm = () => {
    let valid = true;
    Object.values(loginData.errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  const emailIsValid = (value) => {
    return value.length === 0 ? 'Email cannot be empty' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email' : '';
  }

  const passwordIsValid = (value) => {
    return value.length === 0 ? 'Email cannot be empty' : !/^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])\S{6,}$/.test(value) ? 'Invalid password' : '';
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setResponse(login());
  }

  const handleFormChange = (name, value, validate) => {
    const error = validate ? validate(value) : '';
    const newLoginData = { ...loginData, [name]: value, errors: { ...loginData.errors, [name]: error } };
    setLoginData(newLoginData);
  }

  const login = () => {
    if (loginData.email === 'test@test.pl' && loginData.password === 'Password1') {
      return 200;
    }

    if (!emailIsValid(loginData.email) || !passwordIsValid(loginData.password)) {
      return 422;
    }
    
    return 401;
  }

  return (
    <LoginContainer>
        { response === 200 ? (
          <LoginInnerContainer>
            <Header>Login successful</Header>
          </LoginInnerContainer>
        ) : (
          <LoginInnerContainer>
            <Header>Sign in</Header>
            <form method="POST" action="" onSubmit={handleSubmit}>
              <LoginFormFields>
                  <InputRow name="email" value={loginData.email} type="text" labelText="Email" onChange={handleFormChange} validate={emailIsValid} error={loginData.errors.email} />
                  <InputRow name="password" type="password" value={loginData.password} labelText="Password" onChange={handleFormChange} validate={passwordIsValid} error={loginData.errors.password} />
                  <InputRow name="remember" value={loginData.remember} type="checkbox" labelText="Remember me" onChange={handleFormChange} />
                  <ErrorInfo>{ response === 422 ? 'Invalid data' : response === 401 ? 'Invalid email or password' : ''}</ErrorInfo>
                  <SubmitButton type="submit" value="Submit" />
              </LoginFormFields>
            </form>
          </LoginInnerContainer>
        ) }
    </LoginContainer>
  );
}

function App() {
  return (
    <LoginForm />
  );
}

const domContainer = document.querySelector('#container');
ReactDOM.render(<App />, domContainer);
