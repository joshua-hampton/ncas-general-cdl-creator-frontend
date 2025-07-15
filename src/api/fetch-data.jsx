import React, { useState } from 'react'; 

const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com/ncasuk'
const AMF_CVS_RAW_BASE_URL = `${GITHUB_RAW_BASE_URL}/AMF_CVs`
const INSTRUMENTS_RAW_BASE_URL = `${GITHUB_RAW_BASE_URL}/ncas-data-instrument-vocabs`
const GITHUB_API_BASE = 'https://api.github.com/repos/ncasuk'
const GITHUB_API_CVS_BASE = `${GITHUB_API_BASE}/AMF_CVs`
const GITHUB_API_INSTRUMENTS_BASE = `${GITHUB_API_BASE}/ncas-data-instrument-vocabs`
const validVersionRegex = new RegExp('^v(1[0-9]+|[2-9][0-9]*)\\.[0-9]+\\.[0-9]+$');



export const fetchProducts = async ({ versionNG }) => {
  if (!versionNG) {
    return;
  }
  try {
    const endpoint = `${AMF_CVS_RAW_BASE_URL}/${versionNG}/AMF_CVs/AMF_product.json`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch data products');
    }
    const data = await response.json();
    return data.product.sort((a, b) => a > b ? 1 : -1);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Error fetching products. Please try again later.');
  }
}

export const fetchVersions = async ({ API_OPTIONS }) => {
  let return_data = { "success": false };
  try {
    const endpoint = `${GITHUB_API_CVS_BASE}/releases`;
    const response = await fetch(endpoint, API_OPTIONS);
    if (!response.ok) {
      if (response.status === 403) {
        const data = await response.json();
        const doc_url = data["documentation_url"];
        return_data.documentation_url = doc_url;
        return return_data;
      }
      throw new Error('Failed to fetch versions');
    }
    const data = await response.json();
    var versions = []
    Object.keys(data).forEach((key) => {
      if (data[key].tag_name && validVersionRegex.test(data[key].tag_name)) {
        versions.push(data[key].tag_name)
      }
    })
    return_data.success = true;
    return_data.versions = versions;
    return return_data;
  } catch (error) {
    console.error('Error fetching versions:', error);
    return_data.error = error.message;
    return return_data;
  }
}

export const fetchInstruments = async ({ API_OPTIONS }) => {
  let return_data = { "success": false };
  try {
    const endpoint = `${GITHUB_API_INSTRUMENTS_BASE}/releases?per_page=1`;
    const response = await fetch(endpoint, API_OPTIONS);
    if (!response.ok) {
      if (response.status === 403) {
        const data = await response.json();
        const doc_url = data["documentation_url"];
        return_data.documentation_url = doc_url;
        return return_data;
      }
      throw new Error('Failed to fetch latest instrument vocab version');
    }
    const data = await response.json();
    const inst_version = data[0].tag_name;

    const inst_endpoint = `${INSTRUMENTS_RAW_BASE_URL}/${inst_version}/AMF_CVs/AMF_ncas_instrument.json`;
    const inst_response = await fetch(inst_endpoint);
    if (!inst_response.ok) {
      throw new Error('Failed to fetch instruments');
    }
    const inst_data = await inst_response.json();
    var instruments = [];
    Object.keys(inst_data.ncas_instrument).forEach((key) => {
      instruments.push(key)
    })
    return_data.success = true;
    return_data.instruments = instruments.sort((a, b) => a > b ? 1 : -1);
    return return_data
  } catch (error) {
    console.error('Error fetching instruments:', error);
    return_data.error = error.message;
    return return_data;
  }
}

