package middleware

import (
	"net/http"

	"github.com/urfave/negroni"
)

// CSPMiddleware sets a Content Security Policy that only allows resources from the same origin
func CSPMiddleware() negroni.Handler {
	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		// Set the Content-Security-Policy header - simple for just self
		w.Header().Set("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:")

		next(w, r)
	})
}
