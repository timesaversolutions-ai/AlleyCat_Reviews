import axios from 'axios';

const SHEET_ID = '1YYj8oqUT0dlJrXOC1PeYj06knozwTMD8ASO0EuZ58fs';
const API_KEY = 'AIzaSyC-Jq692uT-dX3pGNbwbHMMd6GPANrfrg4';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;

export const fetchCourts = async () => {
    try {
      const response = await axios.get(BASE_URL);
      const rows = response.data.values;
  
      if (rows.length < 4) {
        throw new Error('Not enough rows in the sheet to get headers and data.');
      }
  
      const headers = rows[3]; // Headers are in the 4th row (index 3)
      const data = rows.slice(4).map(row => {
        let obj = {};
        row.forEach((value, index) => {
          obj[headers[index]] = value;
        });
        return obj;
      });
      return data;
    } catch (error) {
      console.error('Error fetching data from Google Sheets', error);
      throw error;
    }
  };