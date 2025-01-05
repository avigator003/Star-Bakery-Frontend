import api from '../../../../axios/api'

const fetchVisualsData = ({attribute, value, value2})=>{
    const headers = {
        "Content-Type": "application/json",
      };
    console.log(`Fetching data for ${attribute} with value ${value}`)
      return api
        .post(`/graphs/${attribute}`, {value:value, value2:value2}, { headers })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
}

export default fetchVisualsData;