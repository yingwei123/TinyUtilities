package model

import (
	"errors"
	"net/url"
	"tiny/backend/util"
)

type TinyURL struct {
	ID          string `bson:"_id,omitempty" json:"_id"`
	TinyURL     string `bson:"tiny_url" json:"tiny_url"`
	OriginalURL string `bson:"original_url" json:"original_url"`
	Alias       string `bson:"alias" json:"alias"`
	Name        string `bson:"name" json:"name"`
	UserID      string `bson:"user_id" json:"user_id"`
}

func (t *TinyURL) NewTinyURL(baseTinyURL string) error {
	err := t.ValidateTinyURL()
	if err != nil {
		return err
	}

	t.GenerateTinyURL(baseTinyURL)

	return nil
}

func (t *TinyURL) ValidateTinyURL() error {
	if t.OriginalURL == "" {
		return errors.New("original url can not be empty")
	}

	err := t.IsValidFormat(t.OriginalURL)
	if err != nil {
		return err
	}

	return nil
}

func (t *TinyURL) IsValidFormat(inputURL string) error {
	_, err := url.ParseRequestURI(inputURL)
	return err
}

func (t *TinyURL) GenerateTinyURL(baseTinyURL string) {
	if t.Alias != "" {
		t.TinyURL = baseTinyURL + "/" + t.Alias
	} else {
		t.TinyURL = baseTinyURL + "/" + util.GenerateRandomString(5) // Assuming you have a function to generate random strings
	}
}
