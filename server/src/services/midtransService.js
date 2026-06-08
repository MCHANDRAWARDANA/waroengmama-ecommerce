import midtransClient from "midtrans-client";

const config = {
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
};

const snap = new midtransClient.Snap(config);
const coreApi = new midtransClient.CoreApi(config);

export { coreApi };
export default snap;
