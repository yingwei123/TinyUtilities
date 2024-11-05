package repository

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDBClient struct {
	client   *mongo.Client
	database string
	context  context.Context
	cancel   context.CancelFunc
}

// IndexField represents a field and its order for creating an index
type IndexField struct {
	Name  string // The name of the field
	Order int    // 1 for ascending, -1 for descending
}

func CreateMongoClient(atlasURI string) *MongoDBClient {
	clientOptions := options.Client().ApplyURI(atlasURI)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		cancel()
		log.Fatal(err)
		return nil
	}

	m := MongoDBClient{client: client, database: "util", context: ctx, cancel: cancel}

	err = m.CreateTables()
	if err != nil {
		log.Fatal(err)
		return nil
	}

	return &m
}

func (m *MongoDBClient) CreateTables() error {
	err := m.CreateIndex("tiny_url", []IndexField{
		{Name: "tiny_url", Order: 1},
	}, true)
	if err != nil {
		m.Disconnect()
		return err
	}

	return nil
}

func (m *MongoDBClient) Disconnect() {
	m.client.Disconnect(m.context)
	defer m.cancel()
	log.Println("Disconnecting Mongodb")
}

//create unique collection name
func (m *MongoDBClient) CreateIndex(collectionName string, fields []IndexField, unique bool) error {
	keys := bson.D{} // bson.D maintains the order of elements, which is important for compound indexes

	// Build the index keys from the fields slice
	for _, field := range fields {
		keys = append(keys, bson.E{Key: field.Name, Value: field.Order})
	}

	mod := mongo.IndexModel{
		Keys:    keys,                              // Use the constructed keys
		Options: options.Index().SetUnique(unique), // Set uniqueness
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := m.client.Database(m.database).Collection(collectionName)

	_, err := collection.Indexes().CreateOne(ctx, mod)
	if err != nil {
		return err
	}

	return err
}
