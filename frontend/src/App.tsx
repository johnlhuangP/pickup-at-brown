import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react'

function App() {
  return (
    <ClerkProvider publishableKey="your_publishable_key">
      {/* Your app content */}
    </ClerkProvider>
  );
} 