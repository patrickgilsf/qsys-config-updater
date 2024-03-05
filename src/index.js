//imports 
import Core from 'ide_qsys';
import { readdir } from 'node:fs/promises';
import fs from 'fs';
import { mediaMain } from './mediaAPI.js';
import { Creds } from './config.js';

//functions
const getConfigs = async () => {
  let rtn = [];
  try {
    const files = await readdir("./configs");
    for (const file of files) {
      rtn.push(file);
    }
  } catch(err) {
    console.error(err);
  }
  return rtn
};

//main handler 
const main = async () => {
  for (let configPath of await getConfigs()) {
    let fullPath = `./configs/${configPath}`;
    let config = fs.readFileSync(fullPath);
    let configFile = JSON.parse(config);
    let core = new Core({
      ip: configFile.System.ip,
      username: Creds.QRCUser,
      pw: Creds.QRCPin
    });

    for (let deploy of await configFile.System.deployments) {
      
      //turn deploy button off
      if (deploy.off) {
        core.comp = deploy.off;
        core.update(2, {type: "select.1"});
      };

      await mediaMain(core.ip, "configs", fullPath)

    }
  };

}

export {
  main
}