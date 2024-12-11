export default () => ({
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'my-kafka-client',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    topic: process.env.KAFKA_TOPIC || 'inference-topic',
  },
});
