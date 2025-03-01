const firebaseConfig = {
    apiKey: "AIzaSyCmrXOFbVS1FWa9JMYZ984QEmzM6KlIwVI",
    authDomain: "thomasandfriend-c1bd4.firebaseapp.com",
    projectId: "thomasandfriend-c1bd4",
    storageBucket: "thomasandfriend-c1bd4.firebasestorage.app",
    messagingSenderId: "890281627272",
    appId: "1:890281627272:web:fbc64066e327dd5ed6193d",
    measurementId: "G-TWJDS5FS0J"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  /**
   * Sign up a new user using Firebase Authentication.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} username - The user's username.
   * @returns {Promise<Object>} Resolves with the created user object.
   */
  function signUpUser(email, password, username) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Update the user's display name
        return userCredential.user
          .updateProfile({ displayName: username })
          .then(() => {
            console.log("Sign-up successful:", userCredential.user);
            return userCredential.user;
          });
      })
      .catch((error) => {
        console.error("Error during sign-up:", error);
        throw error;
      });
  }
  
  /**
   * Sign in an existing user using Firebase Authentication.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} Resolves with the signed-in user object.
   */
  function signInUser(email, password) {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Sign-in successful:", userCredential.user);
        return userCredential.user;
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        throw error;
      });
  }
  
  /**
   * Sign out the current user using Firebase Authentication.
   * @returns {Promise<void>}
   */
  function signOutUser() {
    return auth
      .signOut()
      .then(() => {
        console.log("Sign-out successful");
      })
      .catch((error) => {
        console.error("Error during sign-out:", error);
        throw error;
      });
  }
  
  window.signUpUser = signUpUser;
  window.signInUser = signInUser;
  window.signOutUser = signOutUser;
  