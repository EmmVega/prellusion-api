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
    // Creates a new topic
    try {
        await pubSubClient.createTopic(topicName);
        console.log(`Topic ${topicName} created.`);
    } catch (error) {
        if (error.code !== 6) { // 6 means 'ALREADY_EXISTS'
            console.error(`Received error while creating topic: ${error.message}`);
            process.exit(1);
        }
    }

    // Creates a new subscription
    try {
        await pubSubClient.topic(topicName).createSubscription(subscriptionName);
        console.log(`Subscription ${subscriptionName} created.`);
    } catch (error) {
        if (error.code !== 6) { // 6 means 'ALREADY_EXISTS'
            console.error(`Received error while creating subscription: ${error.message}`);
            process.exit(1);
        }
    }

    // Receive callbacks for new messages on the subscription
    const subscription = pubSubClient.subscription(subscriptionName);
    const messageHandler = message => {
        console.log('\n--- Message Received ---');
        console.log(`  Data: ${message.data}`);
        console.log(`  Attributes: ${JSON.stringify(message.attributes)}`);
        console.log('------------------------\n');

        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages
    subscription.on('message', messageHandler);

    console.log(`\nListening for messages on ${subscriptionName}...`);
    console.log('Press Ctrl+C to quit.\n');
}

main().catch(console.error);
