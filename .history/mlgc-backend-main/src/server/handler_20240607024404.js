const InputError = require('../error/InputError.js');
const predictBinaryClassificationCancer = require('../services/inferenceService.js');
const storeData = require('../services/storeData.js');
const loadHistoryData = require('../services/loadHistoryData.js');
const crypto = require('crypto');

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

    await storeData(id, data);

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

const getPredictHistoryHandler = async (request, h) => {
  try {
    const { data } = await loadHistoryData();

    return h
      .response({
        status: 'success',
        data,
      })
      .code(200);
  } catch (error) {
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi', 400);
  }
};

const NotFoundHandler = (request, h) =>
  h
    .response({
      status: 'fail',
      message: 'Halaman tidak ditemukan',
    })
    .code(404);

module.exports = { postPredictHandler, NotFoundHandler, getPredictHistoryHandler };