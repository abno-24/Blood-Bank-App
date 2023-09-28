import React, { useEffect, useState } from 'react';
import Layout from '../../components/Shared/Layout/Layout';
import API from '../../services/API';
import moment from 'moment';

const OrgList = () => {
    const [data, setData] = useState([]);
    //find donar records
    const getOrgs = async () => {
        try{
            const {data} = await API.get("/admin/organisation-list");
            // console.log(data);
            if(data?.success){
                setData(data?.orgData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOrgs();
    }, []);

    //DELETE 
    const handleDelete = async (id) => {
        try {
            let answer = window.prompt(
                "Are you sure want to delete this organisation",
                "Sure"
            );
            if(!answer) return;
            const { data } = await API.delete(`/admin/delete-organisation/${id}`);
            alert(data?.message);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((record) => (
                        <tr key={record._id}>
                            <td>{record.name || record.organisationName + " (ORG)"}</td>
                            <td>{record.email}</td>
                            <td>{record.phone}</td>
                            <td>
                                {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(record._id)}>DELETE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default OrgList;