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
	ServerPort    uint   `env:"SERVER_PORT,default=8081"`
}

func LoadEnvironment() (Config, error) {
	var cfg Config

	err := godotenv.Load("../../backend/.env")
	if err != nil {
		log.Printf("could not load environment file: %v", err)
	}

	err = envdecode.Decode(&cfg)
	if err != nil {
		return cfg, err
	}

	if cfg.ServerBaseURL == "http://localhost" {
		cfg.ServerBaseURL = cfg.ServerBaseURL + ":" + strconv.Itoa(int(cfg.ServerPort))
	}

	return cfg, nil
}
