package routes

import (
	"net/http"
	"tiny/backend/routes/handler"

	"github.com/gorilla/mux"
)

// RegisterPageRoute handles serving the static react frontend files
func (a *App) RegisterPageRoute(router *mux.Router) {
	router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir("../../frontend/dist/assets"))))
	router.PathPrefix("/").HandlerFunc(handler.RootHandler())
}
