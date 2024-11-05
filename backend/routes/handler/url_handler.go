package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"tiny/backend/cmd/config"
	model "tiny/backend/internal/models"
	"tiny/backend/internal/service"
	"tiny/backend/routes/middleware"

	"github.com/gorilla/mux"
)

type TinyURL struct {
	TinyURL     string `bson:"tiny_url" json:"tiny_url"`
	OriginalURL string `bson:"original_url" json:"original_url"`
	Alias       string `bson:"alias" json:"alias"`
	Name        string `bson:"name" json:"name"`
	UserID      string `bson:"user_id" json:"user_id"`
}

func TinyURLHandler(cfg config.Config, u service.URLService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var tinyURL TinyURL

		err := json.NewDecoder(r.Body).Decode(&tinyURL)
		if err != nil {
			http.Error(w, "error parsing tiny url", http.StatusBadRequest)
			return
		}

		userID := r.Context().Value(middleware.UserID).(string)

		url, err := u.CreateTinyURL(&model.TinyURL{TinyURL: tinyURL.TinyURL, OriginalURL: tinyURL.OriginalURL, Alias: tinyURL.Alias, Name: tinyURL.Name, UserID: userID}, cfg.ServerBaseURL)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(url)
	}
}

func TinyURLAliasHandler(cfg config.Config, u service.URLService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var tinyURL model.TinyURL

		err := json.NewDecoder(r.Body).Decode(&tinyURL)
		if err != nil {
			http.Error(w, "error parsing tiny url", http.StatusBadRequest)
			return
		}

		available, err := u.IsAliasAvailable(tinyURL.Alias)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]bool{"available": available})
	}
}

func HandleTinyURLRedirect(cfg config.Config, u service.URLService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Extract the ID from the URL path
		path := strings.TrimPrefix(r.URL.Path, "/")
		parts := strings.Split(path, "/")
		if len(parts) != 1 {
			http.Error(w, "invalid URL", http.StatusBadRequest)
			return
		}

		alias := parts[0]

		// Get the original URL from the database using the ID
		originalURL, err := u.GetOriginalURL(alias)
		if err != nil {
			http.Error(w, "URL not found", http.StatusNotFound)
			return
		}

		// Redirect to the original URL
		http.Redirect(w, r, originalURL, http.StatusMovedPermanently)
	}
}

func HandleGetAllURLs(cfg config.Config, u service.URLService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(middleware.UserID).(string)

		urls, err := u.GetAllURLs(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		println(fmt.Sprintf("%v", urls))

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(urls)
	}
}

func HandleDeleteURL(cfg config.Config, u service.URLService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(middleware.UserID).(string)

		id := mux.Vars(r)["id"]

		println(fmt.Sprintf("id: %s", id))

		err := u.DeleteTinyURL(id, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
