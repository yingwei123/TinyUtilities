package middleware

import (
	"net/http"

	"github.com/urfave/negroni"
)

// CSPMiddleware sets a Content Security Policy that allows all images and inlined styles/scripts
func CSPMiddleware() negroni.Handler {
	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		// Set the Content-Security-Policy header, allowing blob URLs for images
		w.Header().Set("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src http: https: data: blob:")

		next(w, r)
	})
}
