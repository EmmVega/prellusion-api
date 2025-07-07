import { PubSub } from '@google-cloud/pubsub';
import * as dotenv from 'dotenv';

dotenv.config();

const pubSubClient = new PubSub({
    apiEndpoint: process.env.PUBSUB_EMULATOR_HOST,
    projectId: process.env.GCP_PROJECT_ID,
});

const topicName = 'script-processing';
const subscriptionName = 'script-processing-sub';

async function main() {
    console.log(`--- Starting Pub/Sub Setup ---`);

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
            // Do not exit, try to proceed if possible
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
            // Do not exit, try to proceed if possible
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

    // Create push subscription
    console.log(`Attempting to create push subscription: ${subscriptionName} for topic ${topicName}...`);
    try {
        await pubSubClient.topic(topicName).createSubscription(subscriptionName, {
            pushConfig: {
                pushEndpoint: 'http://127.0.0.1:8080/ProcessScript', // Go parser's local endpoint
                attributes: {
                    'Content-Type': 'application/cloudevents+json',
                },
            },
            ackDeadlineSeconds: 600, // Give the Go parser 10 minutes to process
        });
        console.log(`Push Subscription ${subscriptionName} created successfully, pointing to http://127.0.0.1:8080/ProcessScript.`);
    } catch (error) {
        console.error(`Error creating push subscription ${subscriptionName}: ${error.message}`);
        process.exit(1);
    }

    console.log(`\n--- Local Pub/Sub Environment Setup Complete ---`);
    console.log(`Topic: ${topicName}`);
    console.log(`Push Subscription: ${subscriptionName} -> http://127.0.0.1:8080/ProcessScript`);
    console.log(`
Now, ensure your Go parser is running and listening on http://127.0.0.1:8080/ProcessScript`);
    console.log(`Then, start your prellusion-api service and trigger the script upload.`);
    console.log(`Check the Go parser's terminal for invocation logs.`);
    console.log(`
Press Ctrl+C to quit this setup script (the topic and subscription will persist).`);
}

main().catch(console.error);
