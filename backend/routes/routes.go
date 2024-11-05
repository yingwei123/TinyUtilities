package routes

import (
	"tiny/backend/cmd/config"
	"tiny/backend/internal/repository"
	"tiny/backend/internal/service"
	"tiny/backend/routes/middleware"

	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

type App struct {
	Router     *negroni.Negroni
	Config     *config.Config
	URLService service.URLService
}

func CreateApp(config config.Config, db *repository.MongoDBClient) *App {
	r := mux.NewRouter()
	n := negroni.New()

	app := &App{Router: n, Config: &config, URLService: service.CreateURLService(repository.CreateUrlRepo(db))}

	n.Use(negroni.NewRecovery())
	n.Use(middleware.CORSMiddleware())
	n.Use(middleware.CSPMiddleware())
	n.Use(middleware.UserIDMiddleware())
	n.Use(negroni.NewLogger())

	app.RegisterWebRoutes(r)
	app.RegisterPageRoute(r)

	n.UseHandler(r)

	return app
}

func NewRouter() *negroni.Negroni {
	router := mux.NewRouter()

	// ... existing routes ...

	n := negroni.New()
	n.Use(negroni.NewLogger())
	n.Use(middleware.CORSMiddleware())
	n.Use(middleware.UserIDMiddleware()) // Add this line
	n.UseHandler(router)

	return n
}
