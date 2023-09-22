import React, { useEffect, useState } from 'react';
import Header from '../../components/Shared/Layout/Header';
import API from "./../../services/API";

const Analytics = () => {
    const [data, setData] = useState([]);
    //GET BLOOD GROUP DATA
    const getBloodGroupData = async () => {
        try {
            const { data } = await API.get("/analytics/bloodGroups-data");
            if(data?.success){
                setData(data?.bloodGroupData);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //lifecycle method
    useEffect(() => {
        getBloodGroupData();
    }, [])
    return (
        <>
            <Header />
            <h1>Analytics Page</h1>
        </>
    )
}

export default Analytics