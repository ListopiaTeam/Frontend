import { render, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { UserProvider, UserContext } from "../UserContext";

// Mock Firebase auth and firestore completely
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: {
      uid: '123',
      email: 'test@example.com',
      sendEmailVerification: vi.fn().mockResolvedValue(true)
    }
  })),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ 
    user: { 
      uid: '123', 
      email: 'test@example.com',
      sendEmailVerification: vi.fn().mockResolvedValue(true)
    } 
  }),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ 
    user: { 
      uid: '123', 
      email: 'newuser@example.com',
      sendEmailVerification: vi.fn().mockResolvedValue(true)
    } 
  }),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(),
  sendEmailVerification: vi.fn().mockResolvedValue(),
  signOut: vi.fn().mockResolvedValue(),
  updateProfile: vi.fn().mockResolvedValue(),
  deleteUser: vi.fn().mockResolvedValue(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({ 
      uid: '123', 
      email: 'test@example.com',
      sendEmailVerification: vi.fn().mockResolvedValue(true)
    });
    return vi.fn();
  })
}));

// Mock Firestore to prevent permission errors
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(),
  updateDoc: vi.fn().mockResolvedValue(),
  deleteDoc: vi.fn().mockResolvedValue()
}));

describe("UserContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with user as null", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    onAuthStateChanged.mockImplementationOnce((auth, callback) => {
      callback(null);
      return vi.fn();
    });

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

  it("should sign in a user successfully", async () => {
    const mockEmail = "test@example.com";
    const mockPassword = "password123";
    const mockMessage = { signin: "Successfully logged in!" };
    const mockUser = { 
      uid: '123', 
      email: mockEmail,
      sendEmailVerification: vi.fn().mockResolvedValue(true)
    };

    const { signInWithEmailAndPassword } = await import("firebase/auth");
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

    let contextValue;

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    await waitFor(() => expect(contextValue.signInUser).toBeDefined());

    await act(async () => {
      await contextValue.signInUser(mockEmail, mockPassword);
    });

    await waitFor(() => {
      expect(contextValue.message).toEqual(mockMessage);
      expect(contextValue.user).toEqual(expect.objectContaining({
        email: mockEmail,
        uid: '123'
      }));
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockEmail,
        mockPassword
      );
    });
  });

  it("should sign up a user successfully", async () => {
    const mockEmail = "newuser@example.com";
    const mockPassword = "newpassword";
    const mockDisplayName = "New User";
    const mockMessage = { signup: "Successful registration!" };

    const { 
      createUserWithEmailAndPassword,
      updateProfile,
      sendEmailVerification
    } = await import("firebase/auth");

    let contextValue;

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    await waitFor(() => expect(contextValue.signUpUser).toBeDefined());

    await act(async () => {
      await contextValue.signUpUser(mockEmail, mockPassword, mockDisplayName);
    });

    await waitFor(() => {
      expect(contextValue.message).toEqual(mockMessage);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockEmail,
        mockPassword
      );
      expect(updateProfile).toHaveBeenCalled();
      expect(sendEmailVerification).toHaveBeenCalled();
    });
  });

  it("should send password reset email successfully", async () => {
    const mockEmail = "reset@example.com";
    const mockMessage = { resetPassword: "Password reset email sent!" };

    const { sendPasswordResetEmail } = await import("firebase/auth");

    let contextValue;

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    await waitFor(() => expect(contextValue.resetPassword).toBeDefined());

    await act(async () => {
      await contextValue.resetPassword(mockEmail);
    });

    await waitFor(() => {
      expect(contextValue.message).toEqual(mockMessage);
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        mockEmail
      );
    });
  });

  it("should update user profile successfully", async () => {
    const mockDisplayName = "Updated User";
    const mockPhotoURL = "http://example.com/photo.jpg";
    const mockMessage = { update: "Successful update!" };

    const { updateProfile } = await import("firebase/auth");

    let contextValue;

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    await waitFor(() => expect(contextValue.updateCredentials).toBeDefined());

    await act(async () => {
      await contextValue.updateCredentials(mockDisplayName, mockPhotoURL);
    });

    await waitFor(() => {
      expect(contextValue.message).toEqual(mockMessage);
      expect(updateProfile).toHaveBeenCalledWith(
        expect.anything(),
        { displayName: mockDisplayName, photoURL: mockPhotoURL }
      );
    });
  });

  it("should log out a user successfully", async () => {
    const mockMessage = {};

    const { signOut, onAuthStateChanged } = await import("firebase/auth");
    
    // Override to return null after logout
    onAuthStateChanged.mockImplementationOnce((auth, callback) => {
      callback(null);
      return vi.fn();
    });

    let contextValue;

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    await waitFor(() => expect(contextValue.logoutUser).toBeDefined());

    await act(async () => {
      await contextValue.logoutUser();
    });

    await waitFor(() => {
      expect(contextValue.message).toEqual(mockMessage);
      expect(contextValue.user).toBeNull();
      expect(signOut).toHaveBeenCalled();
    });
  });

  it("should delete user account successfully", async () => {
    const mockMessage = {};

    const { deleteUser, onAuthStateChanged } = await import("firebase/auth");
    
    // Override to return null after deletion
    onAuthStateChanged.mockImplementationOnce((auth, callback) => {
      callback(null);
      return vi.fn();
    });

    let contextValue;

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    await waitFor(() => expect(contextValue.deleteAccount).toBeDefined());

    await act(async () => {
      await contextValue.deleteAccount();
    });

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
      expect(contextValue.user).toBeNull();
      expect(contextValue.message).toEqual(mockMessage);
    });
  });
});