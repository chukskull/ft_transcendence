import NavBar from "../../../components/Navbar";
import Image from "next/image";

export default function Login() {
  return (
    <main className="h-full w-full">
      <NavBar boolBut={false} />
      <div className="close">
        <div className="imageBall">
          <img src="/assets/Login/ball.svg" alt="temp-logo" />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <div className="rectangle"></div>
      </div>
    </main>
  );
}

// <div className="Login-wrapper z-10">
//   <div className="Login-wrapper-header">
//     <h1 className="Login-title">Login</h1>
//     <p className="Login-subtitle">Enter your email and password</p>
//   </div>
//   <form className="Login-form">
//     <div className="Login-form-group">
//       <label htmlFor="email" className="Login-label">
//         Email
//       </label>
//       <input
//         type="text"
//         className="Login-input"
//         id="email"
//         placeholder="Enter your email"
//       />
//     </div>
//     <div className="Login-form-group">
//       <label htmlFor="password" className="Login-label">
//         Password
//       </label>
//       <input
//         type="password"
//         className="Login-input"
//         id="password"
//         placeholder="Enter your password"
//       />
//     </div>
//     <div className="Login-form-group">
//       <button className="Login-button">Login</button>
//     </div>
//   </form>
// </div>
