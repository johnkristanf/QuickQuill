import axios from "axios"

export const checkSpelling = async(text: string) => {
    try {
        const response = await axios.post('https://api.languagetool.org/v2/check', null, {
            params: {
                text,
                language: 'en-US',
            }
        });

        console.log("matches: ", response.data.matches);
        

        return response.data.matches;

    } catch (error) {
        console.error("Error in checking spelling: ", error)
    }
}