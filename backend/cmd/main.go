package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"tiny/backend/cmd/config"
	"tiny/backend/internal/repository"
	"tiny/backend/routes"
)

func main() {
	cfg, err := config.LoadEnvironment()
	if err != nil {
		log.Fatalf("Failed to load environment variables: %v", err)
	}

	log.Printf("starting server on port %d\n", cfg.ServerPort)

	db := repository.CreateMongoClient(cfg.AtlasURI)
	defer func() {
		db.Disconnect()
	}()

	go func() {
		signalChan := make(chan os.Signal, 1)
		signal.Notify(signalChan, os.Interrupt)
		<-signalChan
		db.Disconnect()
		os.Exit(0)
	}()

	app := routes.CreateApp(cfg, db)

	if err := http.ListenAndServe(fmt.Sprintf(":%d", cfg.ServerPort), app.Router); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
