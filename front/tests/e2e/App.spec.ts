import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */


  // Test Suite: Sign-In Page Tests
test.describe("Sign-In Page Tests", () => {


// If you needed to do something before every test case...
test.beforeEach(async ({ page }) => {
  // Navigate to the app before each test
  await page.goto("http://localhost:5173/sign-in");
});


test("on page load, I see a 'Sign In' title", async ({ page }) => {
    // Wait for the page to load
    await page.waitForTimeout(2000); // You can remove this if you rely on waiting for specific elements instead
  
    // Use a more specific selector to target the <h1> element with the text "Sign In"
    const title = page.locator('h1:has-text("Sign In")'); 
    await expect(title).toBeVisible();
  });
  
  // Test: Check for email input visibility
  test("email input is visible and enabled", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();
  });
  
  // Test: Check for password input visibility
  test("password input is visible and enabled", async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
  });
  
  // Test: Check for sign-in button visibility and state
  test("sign-in button is visible and enabled by default", async ({ page }) => {
    const signInButton = page.locator("button", { hasText: "Sign In" });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();
  });
  
//   // Test: Attempt to sign in with empty inputs
//   test("sign-in fails with empty email and password", async ({ page }) => {
//     // Fill in empty email and password
//   await page.fill("input#email", "");
//   await page.fill("input#password", "");

//   // Click the sign-in button to trigger the submit
//   const signInButton = page.locator("button", { hasText: "Sign In" });
//   await signInButton.click();

//   // Wait for the native validation error message to appear
//   const emailInput = page.locator("input#email");
//   await expect(emailInput).toHaveAttribute('validationMessage', 'Please fill out this field.');

//   const passwordInput = page.locator("input#password");
//   await expect(passwordInput).toHaveAttribute('validationMessage', 'Please fill out this field.');
// });
  
//   // Test: Attempt to sign in with invalid email and password
//   test("sign-in fails with invalid credentials", async ({ page }) => {
//     await page.fill('input[type="email"]', "invalid@example.com");
//     await page.fill('input[type="password"]', "wrongpassword");
  
//     const signInButton = page.locator("button", { hasText: "Sign In" });
//     await signInButton.click();
  
//     const error = page.locator(".error");
//     await expect(error).toHaveText("Incorrect email or password");
//   });
  
  // Test: Successful sign-in redirects to the homepage
  test("sign-in succeeds and redirects with valid credentials", async ({ page }) => {
    await page.fill('input[type="email"]', "testing123@gmail.com");
    await page.fill('input[type="password"]', "testing123");
    await page.waitForTimeout(2000); // Wait for 2 seconds

    const signInButton = page.locator("button", { hasText: "Sign In" });
    await signInButton.click();

    
    await expect(page).toHaveURL("http://localhost:5173"); // Replace with the actual URL you expect after login
  });
  
//   // Test: Sign-in button shows "Signing in..." when clicked
//   test("sign-in button displays loading state when signing in", async ({ page }) => {
//     await page.fill('input[type="email"]', "testing123@gmail.com");
//     await page.fill('input[type="password"]', "testing123");
  
//     const signInButton = page.locator("button", { hasText: "Sign In" });
//     await signInButton.click();
  
//     await expect(signInButton).toHaveText("Signing in...");
//   });

});

// Test Suite: Homepage Tests
test.describe("Homepage Tests", () => {

    
    // Setup: Navigate to the homepage before each test
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:5173"); // Adjust to your homepage URL
      await page.fill('input[type="email"]', "testing123@gmail.com");
      await page.fill('input[type="password"]', "testing123");
  
      const signInButton = page.locator("button", { hasText: "Sign In" });
      await signInButton.click();
      await page.waitForTimeout(2000); // You can remove this if you rely on waiting for specific elements instead

  
    });
  
//     // Test: Check if the Sidebar is visible
// test("sidebar is visible", async ({ page }) => {
//     // Wait for the sidebar to load and be visible
//     await page.waitForTimeout(2000); // You can remove this if you rely on waiting for specific elements instead
//     const sidebar = page.locator('div.sidebar'); // Use the sidebar class name
//     await expect(sidebar).toBeVisible();
//   });
  
  // Test: Check if 'All Upcoming' is visible and clickable in the sidebar
  test("'Basketball' is visible and clickable", async ({ page }) => {
    // Locate the "All Upcoming" link in the sidebar
    const allUpcomingLink = page.locator('a:has-text("Basketball")');
    
    // Assert that the link is visible and clickable
    await expect(allUpcomingLink).toBeVisible();
//     await allUpcomingLink.click();
    
//     // Optionally, you can verify that after clicking, the sidebar reflects the selection
//     const selectedSportLink = page.locator('a.selectedSport');
//     await expect(selectedSportLink).toHaveText("All Upcoming");
  });
  


  // Test: Check if 'All Upcoming' is visible and clickable in the sidebar
  test("Click Basketball", async ({ page }) => {
    // Locate the "All Upcoming" link in the sidebar
    const allUpcomingLink = page.locator('a:has-text("Basketball")');
    
    // Assert that the link is visible and clickable
    await expect(allUpcomingLink).toBeVisible();
    await allUpcomingLink.click();
    

    const NewSession = page.locator('button:has-text("+ New Session")');

    await expect(NewSession).toBeVisible();
    await NewSession.click()

    await page.waitForTimeout(2000); // You can remove this if you rely on waiting for specific elements instead


const create = page.locator('h2:has-text("Create")');

    await expect(create).toBeVisible();



    //     // Optionally, you can verify that after clicking, the sidebar reflects the selection
//     const selectedSportLink = page.locator('a.selectedSport');
//     await expect(selectedSportLink).toHaveText("All Upcoming");
  });
  
    // // Test: Check if the 'Sessions' brand in the Sidebar is visible
    // test("'Sessions' brand is visible in the sidebar", async ({ page }) => {
    //   const brand = page.locator("Sessions");
    //   await expect(brand).toBeVisible();
    //   await expect(brand).toHaveText("Sessions");
    // });
  
    // // Test: Check if the 'All Upcoming' option is selectable in the sidebar
    // test("sidebar 'All Upcoming' is selectable", async ({ page }) => {
    //   const allUpcomingLink = page.locator('a:has-text("All Upcoming")');
    //   await expect(allUpcomingLink).toBeVisible();
    //   await allUpcomingLink.click();
    //   const sidebar = page.locator(".sidebar");
    //   await expect(sidebar).toHaveText("All Upcoming");
    // });
  
    // // Test: Check if sport items in the sidebar are visible and clickable
    // test("sidebar displays and selects a sport", async ({ page }) => {
    //   // Wait for sports list to load (assuming the fetch is complete)
    //   await page.waitForSelector(".sidebarNav ul li");
  
    //   // Get the first sport item and click it
    //   const firstSport = page.locator(".sidebarNav ul li a");
    //   await expect(firstSport).toBeVisible();
    //   await firstSport.click();
  
    //   // Assert that the selected sport is now displayed in the sidebar
    //   await expect(firstSport).toHaveClass(/selectedSport/); // Check for selected style
    // });
  
    // // Test: Check if Feed component is visible and updates on sport selection
    // test("feed updates when sport is selected", async ({ page }) => {
    //   const initialFeed = page.locator(".content");
    //   await expect(initialFeed).toBeVisible();
      
    //   // Click on a sport from the sidebar
    //   const firstSport = page.locator(".sidebarNav ul li a");
    //   await firstSport.click();
  
    //   // Check if the feed is updated
    //   const updatedFeed = page.locator(".content");
    //   await expect(updatedFeed).toBeVisible();
    //   // Assert that the feed has changed (this will depend on your feed's behavior)
    //   await expect(updatedFeed).not.toHaveText("No Sessions Available"); // Example assertion
    // });
  
    // // Test: Check if header navigation links (Sign In / Sign Up) are visible when not logged in
    // test("header displays Sign In and Sign Up when not logged in", async ({ page }) => {
    //   const signInLink = page.locator('nav a:has-text("Sign In")');
    //   const signUpLink = page.locator('nav a:has-text("Sign Up")');
    //   await expect(signInLink).toBeVisible();
    //   await expect(signUpLink).toBeVisible();
    // });
  
    // Test: Check if header shows Profile and Sign Out when logged in
    test("header shows Profile and Sign Out when logged in", async ({ page }) => {
      // Simulate user login (you'll need to handle authentication if required)
      // For example, use cookies or localStorage to simulate logged-in state
      await page.context().addCookies([
        {
          name: 'auth_token',
          value: 'your-auth-token', // Set your auth token here
          domain: 'localhost',
          path: '/',
          httpOnly: true,
        },
      ]);
      await page.reload();
  
      const profileLink = page.locator('nav a:has-text("Profile")');
      const signOutLink = page.locator('nav a:has-text("Sign Out")');
      await expect(profileLink).toBeVisible();
      await expect(signOutLink).toBeVisible();
    });
  });






  // Test Suite: Profile Page Tests
test.describe("Profile Tests", () => {

    
    // Setup: Navigate to the homepage before each test
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:5173"); // Adjust to your homepage URL
      await page.fill('input[type="email"]', "testing123@gmail.com");
      await page.fill('input[type="password"]', "testing123");
  
      const signInButton = page.locator("button", { hasText: "Sign In" });
      await signInButton.click();
      await page.waitForTimeout(2000); // You can remove this if you rely on waiting for specific elements instead
      await page.goto("http://localhost:5173/profile"); // Adjust to your homepage URL
      await page.waitForTimeout(2000); // You can remove this if you rely on waiting for specific elements instead

  
    });



    // Test: Ensure the user profile card is visible and contains correct user data
  test("should display the user profile card", async ({ page }) => {
    const profileName = await page.locator("h2");
    expect(await profileName.textContent()).toContain("testing 123"); // Ensure the name is correct


    const username = await page.locator("h5");
    expect(await username.textContent()).toContain("@testing123");

  });

  // Test: Ensure sports preferences section is visible
  test("should display sports preferences section", async ({ page }) => {
    const sportsPreferencesHeader = page.locator("h6", { hasText: "Sports Preferences" });
    await expect(sportsPreferencesHeader).toBeVisible();

    // // Ensure at least one sport preference is listed
    // const sportItem = page.locator("div.sport-item");
    // await expect(sportItem).toBeVisible();
  });

  // Test: Ensure "Sessions" tab is visible and clickable
  test("should display and navigate to 'Sessions' tab", async ({ page }) => {
    const sessionsTab = page.locator("a", { hasText: "Sessions" });
    await expect(sessionsTab).toBeVisible();
    
    // // Click on "Sessions" tab
    // await sessionsTab.click();

    // // Ensure "Sessions" content is displayed (replace with actual session content locator)
    // const sessionsContent = page.locator("div.sessions-content");
    // await expect(sessionsContent).toBeVisible();
  });

//   // Test: Ensure "Friends" tab is visible and clickable
//   test("should display and navigate to 'Friends' tab", async ({ page }) => {
//     const friendsTab = page.locator("a", { hasText: "Friends" });
//     await expect(friendsTab).toBeVisible();
    
// //     // Click on "Friends" tab
// //     await friendsTab.click();

// //     // Ensure "Friends" content is displayed
// //     const friendsContent = page.locator("div.friends-list");
// //     await expect(friendsContent).toBeVisible();
//    });

  // Test: Ensure "Friend Requests" tab is visible and clickable
  test("should display and navigate to 'Friend Requests' tab", async ({ page }) => {
    const friendRequestsTab = page.locator("a", { hasText: "Friend Requests" });
    await expect(friendRequestsTab).toBeVisible();
    
    // // Click on "Friend Requests" tab
    // await friendRequestsTab.click();

    // // Ensure "Friend Requests" content is displayed
    // const friendRequestsContent = page.locator("div.friend-requests");
    // await expect(friendRequestsContent).toBeVisible();
  });



});