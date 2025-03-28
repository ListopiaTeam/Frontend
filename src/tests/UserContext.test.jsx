import { render, screen, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { UserProvider, UserContext } from "../UserContext"; // Adjust the path accordingly
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile, deleteUser } from "firebase/auth";

// Mock Firebase functions
vi.mock("firebase/auth", () => ({
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
    deleteUser: vi.fn(),
    getAuth: vi.fn(() => ({
      currentUser: null,  // You can mock the current user object here
    })),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null); // Initial state: user is `null`
      const unsubscribeMock = vi.fn();
      return unsubscribeMock; // Return the mock unsubscribe function
    }),
  }));

describe("UserContext", () => {
  it("should initialize with user as null", async () => {
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            expect(value.user).toBeNull();
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  /*it("should sign in a user successfully", async () => {
    const mockEmail = "test@example.com";
    const mockPassword = "password123";
    const mockMessage = { signin: "Successfully logged in!" };

    signInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: mockEmail } });

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            const signIn = async () => {
              await value.signInUser(mockEmail, mockPassword);
              expect(value.message).toEqual(mockMessage);
            };
            act(() => signIn());
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });*/

  it("should sign up a user successfully", async () => {
    const mockEmail = "newuser@example.com";
    const mockPassword = "newpassword";
    const mockDisplayName = "New User";
    const mockMessage = { signup: "Successful registration!" };

    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: "123" } });

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            const signUp = async () => {
              await value.signUpUser(mockEmail, mockPassword, mockDisplayName);
              expect(value.message).toEqual(mockMessage);
            };
            act(() => signUp());
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it("should send password reset email successfully", async () => {
    const mockEmail = "reset@example.com";
    const mockMessage = { resetPassword: "Password reset email sent!" };

    sendPasswordResetEmail.mockResolvedValueOnce();

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            const resetPassword = async () => {
              await value.resetPassword(mockEmail);
              expect(value.message).toEqual(mockMessage);
            };
            act(() => resetPassword());
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it("should update user profile successfully", async () => {
    const mockDisplayName = "Updated User";
    const mockPhotoURL = "http://example.com/photo.jpg";
    const mockMessage = { update: "Successful update!" };

    updateProfile.mockResolvedValueOnce();

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            const updateProfileTest = async () => {
              await value.updateCredentials(mockDisplayName, mockPhotoURL);
              expect(value.message).toEqual(mockMessage);
            };
            act(() => updateProfileTest());
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it("should log out a user successfully", async () => {
    const mockMessage = {};

    signOut.mockResolvedValueOnce();

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            const logout = async () => {
              await value.logoutUser();
              expect(value.message).toEqual(mockMessage);
            };
            act(() => logout());
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it("should delete user account successfully", async () => {
    const mockMessage = {};

    deleteUser.mockResolvedValueOnce();

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            const deleteAccount = async () => {
              await value.deleteAccount();
              expect(deleteUser).toHaveBeenCalled();
            };
            act(() => deleteAccount());
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });
});
