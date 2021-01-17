import development from "./development.config";
import production from "./production.config";
import example from "./example.config";
import flashloan1 from "./flashloan1.config";


const env = process.env.APP_ENV || 'example';

const config = {
  example,
  flashloan1,
  development,
  production
};

export default config[env];
