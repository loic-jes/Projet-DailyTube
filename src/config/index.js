import dev from "./dev.config";
import prod from "./prod.config";

const config = process.env.REACT_APP_MODE === 'prod' ? prod : dev;

export default config;