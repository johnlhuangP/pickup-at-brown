import React from "react";
import { SignIn} from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <SignIn
        fallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/register"
        appearance={{
            elements: {
              footerAction: { display: "none" },
            },
          }}
      />
    </div>
  );
}

export default SignInPage;
