import React from "react";
import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <SignUp
        fallbackRedirectUrl="/register"
        signInFallbackRedirectUrl="/"
        appearance={{
          elements: {
            footerAction: { display: "none" },
          },
        }}
      />
    </div>
  );
}

export default SignUpPage;
