package middleware

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"net/http"

	"github.com/urfave/negroni"
)

// GenerateRandomID creates a random ID for the user
func GenerateRandomID() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

type UserIDContextKey string

var UserID UserIDContextKey = "user_id"

// UserIDMiddleware generates a random ID for new users and sets it as a cookie
func UserIDMiddleware() negroni.Handler {
	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		cookie, err := r.Cookie("user_id")
		if err == http.ErrNoCookie {
			userID, err := GenerateRandomID()
			if err != nil {
				http.Error(w, "Error generating user ID", http.StatusInternalServerError)
				return
			}

			// Set the new ID as a cookie
			cookie = &http.Cookie{
				Name:     "user_id",
				Value:    userID,
				Path:     "/",
				MaxAge:   86400 * 30, // 30 days
				HttpOnly: true,
				Secure:   true, // Set to true if using HTTPS
				SameSite: http.SameSiteStrictMode,
			}

			http.SetCookie(w, cookie)
		}

		userID := cookie.Value

		println(userID)

		next(w, r.WithContext(context.WithValue(r.Context(), UserID, userID)))
	})
}
