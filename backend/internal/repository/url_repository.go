package repository

import (
	"context"
	"fmt"
	"time"
	model "tiny/backend/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type URLRepo struct {
	URLClient      *mongo.Client
	DBName         string
	CollectionName string
}

type UrlRepository interface {
	CreateTinyURL(model.TinyURL) (model.TinyURL, error)
	IsAliasAvailable(alias string) (bool, error)
	GetOriginalURL(alias string) (string, error)
	GetAllURLs(userID string) ([]model.TinyURL, error)
	DeleteTinyURL(alias string, userID string) error
}

func CreateUrlRepo(db *MongoDBClient) *URLRepo {
	return &URLRepo{URLClient: db.client, DBName: db.database, CollectionName: "tiny_url"}
}

func (u *URLRepo) DeleteTinyURL(id string, userID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid ID format: %w", err)
	}

	collection := u.URLClient.Database(u.DBName).Collection(u.CollectionName)
	_, err = collection.DeleteOne(ctx, bson.M{"_id": objectID, "user_id": userID})
	if err != nil {
		return fmt.Errorf("failed to delete tiny URL: %w", err)
	}

	return nil
}

// create a tiny url from given url
func (u *URLRepo) CreateTinyURL(tinyURL model.TinyURL) (model.TinyURL, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := u.URLClient.Database(u.DBName).Collection(u.CollectionName)
	_, err := collection.InsertOne(ctx, tinyURL)
	if err != nil {
		return model.TinyURL{}, fmt.Errorf("failed to insert tinyURL: %w", err)
	}

	return tinyURL, nil
}

// IsAliasAvailable checks if the given alias is available (not already in use)
func (u *URLRepo) IsAliasAvailable(alias string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := u.URLClient.Database(u.DBName).Collection(u.CollectionName)

	filter := bson.M{"alias": alias}
	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return false, fmt.Errorf("failed to check alias availability: %w", err)
	}

	return count == 0, nil
}

// GetOriginalURL retrieves the original URL for a given alias
func (u *URLRepo) GetOriginalURL(alias string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := u.URLClient.Database(u.DBName).Collection(u.CollectionName)

	var result model.TinyURL
	filter := bson.M{"alias": alias}
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "", fmt.Errorf("no URL found for alias: %s", alias)
		}
		return "", fmt.Errorf("failed to get original URL: %w", err)
	}

	return result.OriginalURL, nil
}

func (u *URLRepo) GetAllURLs(userID string) ([]model.TinyURL, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := u.URLClient.Database(u.DBName).Collection(u.CollectionName)

	filter := bson.M{"user_id": userID}
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get all URLs: %w", err)
	}

	var results []model.TinyURL
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode URLs: %w", err)
	}

	return results, nil
}
