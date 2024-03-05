import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const Creds = {
  CoreUser: process.env.CoreUser,
  CorePW: process.env.CorePW,
  QRCUser: process.env.QRCUser,
  QRCPin: process.env.QRCPin
}

const Token = async (ip) => {
  const TokenData = {
    username: Creds.CoreUser,
    password: Creds.CorePW
  };
  
  return new Promise((resolve, reject) => {
    axios.post(`https://${ip}/api/v0/logon`, TokenData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      resolve (res ? res.data.token : "no data from logon to "+ip+"!!")
    })
    .catch(e => reject(e.code))
  })
}

export {
  Token, Creds
}