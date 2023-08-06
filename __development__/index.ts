import webserver from "./module/load/webserver";
import { Config } from "./store";

webserver.load().then(() => webserver.start(Config.api.port));