"use strict";
var __createBinding = this && this.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}),
__setModuleDefault = this && this.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
    o["default"] = v;
}),
__importStar = this && this.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
},
__importDefault = this && this.__importDefault || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.providerContext = void 0;

const axios_1 = __importDefault(require("axios"));
const getBaseUrl_1 = require("./getBaseUrl");
const headers_1 = require("./headers");
const cheerio = __importStar(require("cheerio"));
const hubcloudExtractor_1 = require("./hubcloudExtractor");
const gofileExtracter_1 = require("./gofileExtracter");
const superVideoExtractor_1 = require("./superVideoExtractor");
const gdflixExtractor_1 = require("./gdflixExtractor");

// ✅ Replace react-native-aes-crypto with crypto-js
const CryptoJS = require("crypto-js");

const Aes = {
    encrypt: async (text, key) => {
        return CryptoJS.AES.encrypt(text, key).toString();
    },
    decrypt: async (cipher, key) => {
        const bytes = CryptoJS.AES.decrypt(cipher, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
};

const extractors = {
    hubcloudExtracter: hubcloudExtractor_1.hubcloudExtracter,
    gofileExtracter: gofileExtracter_1.gofileExtracter,
    superVideoExtractor: superVideoExtractor_1.superVideoExtractor,
    gdFlixExtracter: gdflixExtractor_1.gdFlixExtracter
};

exports.providerContext = {
    axios: axios_1.default,
    getBaseUrl: getBaseUrl_1.getBaseUrl,
    commonHeaders: headers_1.headers,
    Aes: Aes,
    cheerio: cheerio,
    extractors: extractors
};