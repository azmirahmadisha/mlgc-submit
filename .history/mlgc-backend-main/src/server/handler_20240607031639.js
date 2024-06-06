const getHistories = require("../services/getHistories");
const predictBinaryClassificationCancer = require("../services/inferenceService");
const storeData = require("../services/storeData");
const crypto = require("crypto");
const InputError = require('../error/InputError.js');

const postPredictHandler = async (request, h) => {
	try {
	  const { model } = request.server.app;
	  const { image } = request.payload;
  
	  const { confidenceScore, label, suggestion } =
		await predictBinaryClassificationCancer(model, image);
	  const id = crypto.randomUUID();
	  const createdAt = new Date().toISOString();
  
	  const data = {
		id,
		result: label,
		suggestion,
		createdAt,
	  };
  
	//   await storeData(id, data);
  
	  return h
		.response({
		  status: 'success',
		  message:
			confidenceScore >= 100 || confidenceScore < 1
			  ? 'Model is predicted successfully'
			  : 'Model is predicted successfully but under threshold. Please use the correct picture',
		  data,
		})
		.code(201);
	} catch (error) {
	  throw new InputError('Terjadi kesalahan dalam melakukan prediksi', 400);
	}
  };

async function getPredictionHistories(request, h) {
	try {
		const histories = await getHistories();

		return h
			.response({
				status: "success",
				data: histories,
			})
			.code(200);
	} catch (error) {
		return h
			.response({
				status: "fail",
				message: "Failed to fetch prediction histories",
			})
			.code(500);
	}
}
module.exports = { postPredictHandler, getPredictionHistories };