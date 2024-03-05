//imports
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import {
  Token
} from './config.js'

//check for folder
const checkFolder = async (ip, folder) => {
  let token = await Token(ip);
  let header = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  };
  let rtn = false;
  return new Promise((resolve, reject) => {
    axios.get(`https://${ip}/api/v0/cores/self/media`, header)
      .then(res => {
        res.data.forEach(f => {
          f.path == folder ? rtn = true : null;
        })
        resolve(rtn);
      })
      .catch(e => reject(e.code))
  })
};

const createFolder = async (ip, folder) => {
  let token = await Token(ip);
  let header = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  };
  let data = {
    name: folder
  };
  return new Promise((resolve, reject) => {
    axios.post(`https://${ip}/api/v0/cores/self/media`, data, header)
      .then(res => {
        resolve(res ? `${folder} created!` : null)
      })
      .catch(e => reject(e.code))
  })
}

const uploadData = async (ip, folder, file) => {
  let token = await Token(ip);
  let data = new FormData();
  data.append('media', fs.createReadStream(file));
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://${ip}/api/v0/cores/self/media/${folder}`, 
    headers: {
      Authorization: `Bearer ${token}`,
      ...data.getHeaders() 
    },
    data: data
    //can also be just:
    //data,
  };
  return new Promise((resolve, reject) => {
    axios.request(config)
      .then(res => {
        resolve(res ? `${file} successfully updated to ${ip}!` : 'there was an error')
      })
      .catch(e => reject(e))
  })
}

const mediaMain = async (ip, folder, file) => {
  let existingFolder = await checkFolder(ip, folder);

  if (!existingFolder) {
    console.log(`no folder found for ${ip}, creating one...`);
    let addConfig = new Promise(resolve => resolve(createFolder(ip, folder)));
    let uploadAPI = new Promise(resolve => resolve(uploadData(ip, folder, file)));

    let configSuccess = Promise.all([addConfig, uploadAPI]);
    configSuccess
      ? console.log(`successfully created ${folder} folder on ${ip}`)
      : console.log('failed to created folder on '+ ip)
  } else {
    console.log(`${ip} already has a ${folder} folder`);
    await uploadData(ip, folder, file);
  }
}

export {
  mediaMain
}

