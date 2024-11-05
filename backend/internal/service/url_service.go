package service

import (
	"errors"
	model "tiny/backend/internal/models"
	"tiny/backend/internal/repository"
)

type URLService interface {
	CreateTinyURL(tinyURL *model.TinyURL, baseTinyURL string) (model.TinyURL, error)
	IsAliasAvailable(alias string) (bool, error)
	GetOriginalURL(alias string) (string, error)
	GetAllURLs(userID string) ([]model.TinyURL, error)
	DeleteTinyURL(id string, userID string) error
}

type URLServiceImpl struct {
	MongoDbClient repository.UrlRepository
}

func CreateURLService(db repository.UrlRepository) URLService {
	return &URLServiceImpl{MongoDbClient: db}
}

func (u *URLServiceImpl) CreateTinyURL(tinyURL *model.TinyURL, baseTinyURL string) (model.TinyURL, error) {
	err := tinyURL.ValidateTinyURL()
	if err != nil {
		return model.TinyURL{}, err
	}

	tinyURL.GenerateTinyURL(baseTinyURL)

	return u.MongoDbClient.CreateTinyURL(*tinyURL)
}

func (u *URLServiceImpl) IsAliasAvailable(alias string) (bool, error) {
	if alias == "" {
		return false, errors.New("alias is required")
	}

	return u.MongoDbClient.IsAliasAvailable(alias)
}

func (u *URLServiceImpl) GetOriginalURL(alias string) (string, error) {
	if alias == "" {
		return "", errors.New("alias is required")
	}

	return u.MongoDbClient.GetOriginalURL(alias)
}

func (u *URLServiceImpl) GetAllURLs(userID string) ([]model.TinyURL, error) {
	if userID == "" {
		return nil, errors.New("user ID is required")
	}

	return u.MongoDbClient.GetAllURLs(userID)
}

func (u *URLServiceImpl) DeleteTinyURL(id string, userID string) error {
	if id == "" || userID == "" {
		return errors.New("url id and user ID are required")
	}

	return u.MongoDbClient.DeleteTinyURL(id, userID)
}
