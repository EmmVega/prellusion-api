import { PubSub } from '@google-cloud/pubsub';
import * as dotenv from 'dotenv';

dotenv.config();

const pubSubClient = new PubSub({
    apiEndpoint: process.env.PUBSUB_EMULATOR_HOST,
    projectId: process.env.GCP_PROJECT_ID,
});

const scriptProcessingTopic = 'script-processing';
const scriptProcessingSub = 'script-processing-sub';
const completionTopic = 'parsing-completed';
const completionSub = 'parsing-completed-sub';

async function setupTopicAndSubscription(topicName: string, subscriptionName: string, pushEndpoint?: string) {
    console.log(`\n--- Setting up ${topicName} ---`);
    
    // Delete existing subscription if it exists
    console.log(`Attempting to delete existing subscription: ${subscriptionName}...`);
    try {
        await pubSubClient.subscription(subscriptionName).delete();
        console.log(`Subscription ${subscriptionName} deleted successfully.`);
    } catch (error) {
        if (error.code === 5) { // NOT_FOUND
            console.log(`Subscription ${subscriptionName} not found, no need to delete.`);
        } else {
            console.error(`Error deleting subscription ${subscriptionName}: ${error.message}`);
        }
    }

    // Delete existing topic if it exists
    console.log(`Attempting to delete existing topic: ${topicName}...`);
    try {
        await pubSubClient.topic(topicName).delete();
        console.log(`Topic ${topicName} deleted successfully.`);
    } catch (error) {
        if (error.code === 5) { // NOT_FOUND
            console.log(`Topic ${topicName} not found, no need to delete.`);
        } else {
            console.error(`Error deleting topic ${topicName}: ${error.message}`);
        }
    }

    // Create topic
    console.log(`Attempting to create topic: ${topicName}...`);
    try {
        await pubSubClient.createTopic(topicName);
        console.log(`Topic ${topicName} created successfully.`);
    } catch (error) {
        console.error(`Error creating topic ${topicName}: ${error.message}`);
        process.exit(1);
    }

    // Create subscription (push or pull based on whether pushEndpoint is provided)
    if (pushEndpoint) {
        console.log(`Attempting to create push subscription: ${subscriptionName} for topic ${topicName}...`);
        try {
            await pubSubClient.topic(topicName).createSubscription(subscriptionName, {
                pushConfig: {
                    pushEndpoint: pushEndpoint,
                    attributes: {
                        'Content-Type': 'application/cloudevents+json',
                    },
                },
                ackDeadlineSeconds: 600,
            });
            console.log(`Push Subscription ${subscriptionName} created successfully, pointing to ${pushEndpoint}.`);
        } catch (error) {
            console.error(`Error creating push subscription ${subscriptionName}: ${error.message}`);
            process.exit(1);
        }
    } else {
        console.log(`Attempting to create pull subscription: ${subscriptionName} for topic ${topicName}...`);
        try {
            await pubSubClient.topic(topicName).createSubscription(subscriptionName, {
                ackDeadlineSeconds: 600,
            });
            console.log(`Pull Subscription ${subscriptionName} created successfully.`);
        } catch (error) {
            console.error(`Error creating pull subscription ${subscriptionName}: ${error.message}`);
            process.exit(1);
        }
    }
}

async function main() {
    console.log(`--- Starting Pub/Sub Setup ---`);

    // Setup script processing topic (with push subscription to Go parser)
    const scriptProcessingEndpoint = `http://127.0.0.1:8080/projects/${process.env.GCP_PROJECT_ID}/topics/${scriptProcessingTopic}`;
    await setupTopicAndSubscription(scriptProcessingTopic, scriptProcessingSub, scriptProcessingEndpoint);

    // Setup parsing completion topic (with pull subscription for API to consume)
    await setupTopicAndSubscription(completionTopic, completionSub);

    console.log(`\n--- Local Pub/Sub Environment Setup Complete ---`);
    console.log(`\nTopics and Subscriptions:`);
    console.log(`  1. ${scriptProcessingTopic} -> ${scriptProcessingSub} (push to Go parser)`);
    console.log(`     Endpoint: ${scriptProcessingEndpoint}`);
    console.log(`  2. ${completionTopic} -> ${completionSub} (pull by API)`);
    console.log(`
Setup Instructions:
1. Start your Go parser: 'go run cmd/main.go' (listening on :8080)
2. Start your prellusion-api service
3. The API can now:
   - Publish to ${scriptProcessingTopic} to trigger script processing
   - Subscribe to ${completionSub} to receive completion notifications
4. Check the Go parser's terminal for processing logs
`);
    console.log(`Press Ctrl+C to quit this setup script (topics and subscriptions will persist).`);
}

main().catch(console.error);
