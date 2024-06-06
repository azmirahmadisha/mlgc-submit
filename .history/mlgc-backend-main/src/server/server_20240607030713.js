require("dotenv").config();

const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel.js");
const InputError = require('../error/InputError.js');

(async () => {
	const server = Hapi.server({
		port: 3000,
		host: process.env.ENVIRONMENT === "production" ? "0.0.0.0" : "localhost",
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	});

	const model = await loadModel();
	server.app.model = model;

	server.route(routes);

	server.ext('onPreResponse', (request, h) => {
		const { response } = request;
		if (response instanceof InputError) {
		  return h.response({
			status: 'fail',
			message: `Terjadi kesalahan dalam melakukan prediksi`,
		  }).code(400);
		}
		if (response.isBoom && response.output.statusCode === 413) {
		  return h.response({
			status: 'fail',
			message: 'Payload content length greater than maximum allowed: 1000000',
		  }).code(413);
		}
		return h.continue;
	  });

	await server.start();
	console.log(`Server start at: ${server.info.uri}`);
})();