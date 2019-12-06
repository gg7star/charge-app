import axios from 'axios';

function checkStatus(responseData) {
  if(responseData.status >= 200 && responseData.status < 300)
    return { data: responseData.data, headers: responseData.headers, status: responseData.status };
  const error = new Error((responseData.data && responseData.data.response && responseData.data.response.message) || '');
  
  error.response = responseData.data;
  throw error;  
}

export async function processRequest(url = '', method = 'GET', data = null) {
  let headers = {
    'Content-Type': 'application/json'
  };
  let request = {
    method,
    crossDomain: true,
    url: url
  };

  if(data) {
    request = {
      ...request,
      headers,
      data: data
    };
  } else {
    request = {
      ...request,
      headers
    };
  }
  return axios(request)
    .then(response =>
      checkStatus(response)
    ).catch(err => {
      throw err.response;
    });
}