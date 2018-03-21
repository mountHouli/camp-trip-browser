import axios from 'axios'
import { apiUrl } from '../config'

export async function get (path) {
  try {
    const response = await axios.get(`${apiUrl}${path}`, {
      // By default, Axios rejects its promise if the HTTP status it gets back is outside the 2xx range.
      // Prevent this, making axios resolve its promise for all HTTP status codes.
      validateStatus: (status) => true
    })
    return {
      data: response.data.data
    }
  }
  catch (err) {
    return {
      error: err
    }
  }
}
