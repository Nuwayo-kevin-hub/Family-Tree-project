import api from "./axios";


export const getDashboard = async(familyId)=>{

    const response = await api.get(
        `/dashboard/`
    );

    return response.data;

};