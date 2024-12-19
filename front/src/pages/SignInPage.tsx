import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./signInPage.module.css";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle Supabase error messages
      if (error.status === 400) {
        setError("Incorrect email or password");
      } else if (error.message === "Invalid login credentials" || error.message?.includes("Invalid")) {
        setError("Incorrect email or password");
      } else if (error.message === "Email not confirmed") {
        setError("Please verify your email address before signing in");
      } else if (error.message?.includes("rate limit")) {
        setError("Too many attempts. Please try again later");
      } else {
        setError("Failed to sign in. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Sign In</h1>
        {error && (
          <div className={styles.error}>
            <svg 
              viewBox="0 0 24 24" 
              className={styles.errorIcon}
              fill="currentColor"
              height="20"
              width="20"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
            </svg>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className={styles.links}>
          <a href="/sign-up" className={styles.link}>Don't have an account? Sign up</a>
          {/* <a href="/forgot-password" className={styles.link}>Forgot password?</a> */}
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
