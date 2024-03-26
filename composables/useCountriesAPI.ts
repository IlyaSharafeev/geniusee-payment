import {ref} from "vue";
import axios from "axios";

export const countries = ref([]);

export const fetchCountries = async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name');
        countries.value = response.data;
        console.log(countries.value);
    } catch (error) {
        console.error(error);
    }
}
