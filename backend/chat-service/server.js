const Fastify = require('fastify')({ logger: true });
const database = require('./config/database')


const start = async () => {
	try {
		await database.connect();

		// await database.CreateChatTables();

		await Fastify.listen({ port: 3003, host: '0.0.0.0' });
		console.log(`🌐 chat server running on http://localhost:3003`);
	} catch (err) {
		Fastify.log.error(err);
		process.exit(1);
	}
};

Fastify.get('/health', async (request, reply) => {
	return {
		status: 'OK',
		service: 'chat--service',
		API: 'Fisrt API'
	};
});
start();
