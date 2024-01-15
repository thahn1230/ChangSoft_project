import styled from "styled-components";
import logo from "resource/changSoft_logo.png";

const LoginHeaderWrapper = styled.div`
background: transparent;
height: 50px;
display: flex;
flex-flow: row nowrap;
justify-content: center;
align-items: center;
outline: none;
&:hover {
  cursor: pointer;
}

span {
  font-size: 2rem;
}
a {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  color: black;
  div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 100%;
    img {
      height: 100%;
    }
    span {
      font-weight: bold;
    }
  }
}
`;


export const LoginHeader = (props: any) => {
    return (
      <LoginHeaderWrapper tabIndex={-1} {...props}>
        <a href="/" tabIndex={-1}>
          <div>
            <img id="logo" src={logo} alt={"Changsoft"} />
          </div>
        </a>
      </LoginHeaderWrapper>
    );
  };