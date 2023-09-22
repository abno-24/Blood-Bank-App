import React, { useEffect, useState } from 'react'
import Layout from '../../components/Shared/Layout/Layout'
import API from '../../services/API';
import moment from 'moment';

const OrganisationPage = () => {
    const [data, setData] = useState([]);
    //find organisation records
    const getOrganisations = async () => {
        try{
            const {data} = await API.get("/inventory/get-organisation");
            // console.log(data);
            if(data?.success){
                setData(data?.organisations);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOrganisations();
    }, []);

    return (
        <Layout>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Address</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((record) => (
                    <tr key={record._id}>
                        <td>{record.name || record.organisationName + " (ORG)"}</td>
                        <td>{record.email}</td>
                        <td>{record.phone}</td>
                        <td>{record.address}</td>
                        <td>
                            {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default OrganisationPage;