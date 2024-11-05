package routes

import (
	"tiny/backend/routes/handler"

	"github.com/gorilla/mux"
)

// Combined handler for TinyURL redirects and static file serving
func (a *App) RegisterWebRoutes(router *mux.Router) {
	router.HandleFunc("/qrcode", handler.QrCodeHandler()).Methods("POST", "GET")
	router.HandleFunc("/url", handler.TinyURLHandler(*a.Config, a.URLService)).Methods("POST")
	router.HandleFunc("/url/alias", handler.TinyURLAliasHandler(*a.Config, a.URLService)).Methods("POST")
	router.HandleFunc("/url/{id}", handler.HandleDeleteURL(*a.Config, a.URLService)).Methods("DELETE")
	router.HandleFunc("/{alias}", handler.HandleTinyURLRedirect(*a.Config, a.URLService)).Methods("GET")
	router.HandleFunc("/url/all", handler.HandleGetAllURLs(*a.Config, a.URLService)).Methods("GET")
}
