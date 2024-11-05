package handler

import (
	"net/http"
	"os"
	"path/filepath"
)

func RootHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		staticDir := "../../frontend/dist" // Path to the directory containing the static files

		requestedPath := filepath.Join(staticDir, r.URL.Path)

		if _, err := os.Stat(requestedPath); err == nil {
			http.ServeFile(w, r, requestedPath)
		} else {
			http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
		}
	}
}
