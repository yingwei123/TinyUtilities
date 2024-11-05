package handler

import (
	"net/http"
	"os"
	"path/filepath"
	"tiny/backend/cmd/config"
)

func RootHandler(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		requestedPath := filepath.Join(cfg.StaticDir, r.URL.Path)

		if _, err := os.Stat(requestedPath); err == nil {
			http.ServeFile(w, r, requestedPath)
		} else {
			http.ServeFile(w, r, filepath.Join(cfg.StaticDir, "index.html"))
		}
	}
}
