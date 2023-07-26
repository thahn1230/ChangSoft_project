import React, { Fragment, useCallback } from "react";
// import styled from 'styled-components';
import logo from "./../resource/changSoft_logo.png";
import { useNavigate } from "react-router-dom";

export const PolicyAgreementList = [
  {
    title: "창소프트아이디씨(Changsoft IDC) 이용약관",
    link: "/policy#conditions-and-terms",
    anchor: "conditions-and-terms",
    key: "c1",
  },
  {
    title: "개인정보수집및이용",
    link: "/policy#privacy-policy",
    anchor: "privacy-policy",
    key: "c3",
  },
];

// const LoginHeaderWrapper = styled.div`
//   background: transparent;
//   height: 50px;
//   display: flex;
//   flex-flow: row nowrap;
//   justify-content: center;
//   align-items: center;
//   outline: none;
//   &:hover {
//     cursor: pointer;
//   }

//   span {
//     font-size: 2rem;
//   }
//   a {
//     width: 100%;
//     height: 100%;
//     display: flex;
//     flex-flow: row nowrap;
//     justify-content: center;
//     align-items: center;
//     color: black;
//     div {
//       display: flex;
//       flex-flow: row nowrap;
//       justify-content: center;
//       align-items: center;
//       height: 100%;
//       img {
//         height: 100%;
//       }
//       span {
//         font-weight: bold;
//       }
//     }
//   }
// `;

export const LoginHeader = (props: any) => {
  return (
    <LoginHeaderWrapper tabIndex={-1} {...props}>
      <a href="/" tabIndex={-1}>
        <div>
          <img id="logo" src={logo} alt={"Changsoft"} />
        </div>
        <div>
          <span className="name">{"Changsoft IDC"}</span>
        </div>
      </a>
    </LoginHeaderWrapper>
  );
};

// const SignupAgreementWrapper = styled.div`
//   margin-top: 10px;
//   font-size: ${(p) => p.theme.font.size.sm};
//   a {
//     font-size: ${(p) => p.theme.font.size.sm};
//   }
//   span.bold {
//     font-size: ${(p) => p.theme.font.size.sm};
//     font-weight: bold;
//   }
//   span.right-space {
//     font-size: ${(p) => p.theme.font.size.sm};
//     margin-right: 0.2em;
//   }
//   span {
//     font-size: ${(p) => p.theme.font.size.sm};
//     line-break: anywhere;
//   }
// `;

// export const SignupAgreement = () => {
//   const history = useNavigate();
//   const handleClick = useCallback(
//     (ev:any) => {
//       ev.preventDefault();
//       history.push(ev.target.getAttribute('href'));
//     },
//     [history],
//   );
//   return (
//     <SignupAgreementWrapper>
//       <span className='right-space'>본인은</span>
//       <span className='bold'>만 14세 이상</span>
//       이며<span className='right-space'>,</span>
//       {PolicyAgreementList &&
//         PolicyAgreementList.map(({ title, link }, idx) => {
//           return (
//             <Fragment key={String(idx)}>
//               {idx > 0 ? (
//                 <span key={idx} className='right-space'>
//                   {','}
//                 </span>
//               ) : (
//                 ''
//               )}
//               <span>
//                 <a href={link} onClick={handleClick}>
//                   {title}
//                 </a>
//               </span>
//             </Fragment>
//           );
//         })}
//       <span className='right-space' />
//       <span className='right-space'>내용을 확인하였으며</span>
//       <span className='bold'>동의합니다.</span>
//     </SignupAgreementWrapper>
//   );
// };

// const LoginOptionButtonsWrapper = styled.div`
//   display: flex;
//   flex-flow: row nowrap;
//   justify-content: center;
//   /* align-items: center; */
//   margin-top: 10px;
//   ul {
//     margin: 0;
//     padding: 0;
//     list-style: none;
//     display: flex;
//     flex-flow: row nowrap;
//     li {
//       a {
//         color: gray;
//         /* font-size: 0.8rem; */
//         font-size: ${(p) => p.theme.font.size.md};
//         text-decoration: none;
//         &:hover {
//           text-decoration: underline;
//         }
//       }
//     }
//     li + li::before {
//       content: '•';
//       content: '|';
//       margin: 0px 4px;
//     }
//   }
// `;

export const LoginCardContainer = ({ children }: any) => (
  <div className="card-container" style={{ maxWidth: "400px" }}>
    {children}
  </div>
);

// export const LoginOptionButtons = () => {
//   const history = useNavigate();
//   const handleClick = (ev:any) => {
//     ev.preventDefault();
//     history.push(ev.target.getAttribute('href'));
//   };
//   return (
//     <LoginOptionButtonsWrapper>
//       <ul>
//         <li>
//           <a href={'/login/id'} onClick={handleClick}>
//             아이디 찾기
//           </a>
//         </li>
//         <li>
//           <a
//             href={'/login/password/reset'}
//             value={'/login/password/reset'}
//             onClick={handleClick}
//           >
//             비밀번호 찾기
//           </a>
//         </li>
//       </ul>
//     </LoginOptionButtonsWrapper>
//   );
// };
