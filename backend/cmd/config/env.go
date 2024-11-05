package config

import (
	"log"
	"strconv"

	"github.com/joeshaw/envdecode"
	"github.com/joho/godotenv"
)

type Config struct {
	AtlasURI      string `env:"ATLAS_URI,required"`
	ServerBaseURL string `env:"SERVER_BASE_URL,default=http://localhost"`
	ServerPort    uint   `env:"PORT,default=8081"`
	StaticDir     string `env:"STATIC_DIR,default=./frontend/dist"`
}

func LoadEnvironment() (Config, error) {
	var cfg Config

	err := godotenv.Load("../../backend/.env")
	if err != nil {
		log.Printf("could not load environment file: %v", err)
	}

	err = envdecode.Decode(&cfg)
	if err != nil {
		log.Printf("could not load environment variables: %v", err)
		return cfg, err
	}

	if cfg.ServerBaseURL == "http://localhost" {
		cfg.ServerBaseURL = cfg.ServerBaseURL + ":" + strconv.Itoa(int(cfg.ServerPort))
	}

	return cfg, nil
}
