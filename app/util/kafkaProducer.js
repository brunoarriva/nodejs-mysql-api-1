const {Kafka} = require('kafkajs');

const kafka = new Kafka({
  clientId: 'sword-health-app',
  brokers: [process.env.KAFKA_BROKER_1],
});

const producer = kafka.producer();

module.exports = {

  produce: async (taskId, username) => {
    const msg = 'New Task [' + taskId + '] created for "' + username + '".';
    await producer.connect();
    try {
      await producer.send({
        topic: 'sword-health-task-log',
        messages: [{value: msg}],
      });
      console.log('Message produced:', msg);
    } catch (err) {
      console.error('Could not write message. ' + err);
    }
  },

};
