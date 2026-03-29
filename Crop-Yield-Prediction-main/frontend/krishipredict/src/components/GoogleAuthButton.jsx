import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { saveSession, ADMIN_EMAIL } from "../api/auth";

const BASE   = import.meta.env.VITE_EXPRESS_URL || "http://localhost:5000";
const G_BLUE = "#4285F4";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

/**
 * GoogleAuthButton
 *
 * Props:
 *   onSuccess(user)  — called with the saved user object
 *   onError(msg)     — called with an error string
 *   role             — 'farmer' | 'seller' | 'admin' (used on REGISTER only)
 *                      On LOGIN the role is read from existing mock-user store
 *   label            — button text
 *   mode             — 'register' | 'login'
 */
export default function GoogleAuthButton({
  onSuccess,
  onError,
  role = "farmer",
  label = "Continue with Google",
  mode = "register",
}) {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        /* 1. Fetch Google profile */
        const { data: profile } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        /* 2. On LOGIN — look up existing mock user by email to preserve their role */
        let resolvedRole = role;
        if (mode === "login") {
          const mockUsers = JSON.parse(localStorage.getItem("kp_mock_users") || "[]");
          const existing  = mockUsers.find(u => u.email === profile.email);
          if (existing) resolvedRole = existing.role;
        }

        /* 3. Admin email always gets admin role */
        if (profile.email === ADMIN_EMAIL) resolvedRole = "admin";

        const googleUser = {
          id:       `g_${profile.sub}`,
          name:     profile.name,
          email:    profile.email,
          avatar:   profile.picture,
          role:     resolvedRole,
          phone:    "",
          address:  "",
          provider: "google",
        };

        /* 4. Try backend first; fall back to local session if unreachable */
        try {
          const { data } = await axios.post(`${BASE}/api/auth/google-token`, {
            access_token: tokenResponse.access_token,
            role: resolvedRole,
          });
          saveSession(data.token, data.user);
          onSuccess(data.user);
        } catch {
          /* Backend offline — save to mock store if registering */
          if (mode === "register") {
            const mockUsers = JSON.parse(localStorage.getItem("kp_mock_users") || "[]");
            if (!mockUsers.find(u => u.email === googleUser.email)) {
              localStorage.setItem(
                "kp_mock_users",
                JSON.stringify([...mockUsers, { ...googleUser, password: null }])
              );
            }
          }
          const mockToken = btoa(JSON.stringify({
            id: googleUser.id, email: googleUser.email,
            exp: Date.now() + 86400000,
          }));
          saveSession(mockToken, googleUser);
          onSuccess(googleUser);
        }
      } catch {
        onError("Google sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => onError("Google sign-in was cancelled or blocked. Check your Client ID settings."),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "0.65rem", width: "100%",
        padding: "0.75rem 1.25rem",
        background: "#fff", border: "1.5px solid #dadce0", borderRadius: 10,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
        fontWeight: 600, color: "#3c4043",
        transition: "all 0.2s", opacity: loading ? 0.7 : 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={e => {
        if (!loading) {
          e.currentTarget.style.boxShadow = `0 2px 8px rgba(66,133,244,0.25)`;
          e.currentTarget.style.borderColor = G_BLUE;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#dadce0";
      }}
    >
      {loading ? (
        <>
          <span style={{
            width: 18, height: 18,
            border: "2px solid #dadce0", borderTopColor: G_BLUE,
            borderRadius: "50%", animation: "spin 0.7s linear infinite",
            display: "inline-block",
          }} />
          Connecting to Google...
        </>
      ) : (
        <>
          <GoogleIcon />
          {label}
        </>
      )}
    </button>
  );
}
