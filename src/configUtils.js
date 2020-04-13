const fs = require("fs");
const yaml = require("yaml");

class ConfigUtils {

  get() {
    
    // Read config.yml file and get content
    let configContent = fs.readFileSync("./config.yml", "utf8");

    // Parse file content and get configuration
    const config = yaml.parse(configContent);

    //Return object
    return config;
  }
}

module.exports = {
  ConfigUtils: ConfigUtils
};