import React, {useState, useEffect} from 'react';
import { Channel, MessageTeam } from 'stream-chat-react';
import axios from 'axios';
import { useChatContext } from 'stream-chat-react';
import { ChannelInner, CreateChannel} from './';

const initialState = {
    Age: '',
    Weight: '',
    Height: '',
    Blood_pressure: '',
}

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType, viewProfile }) => {
    const [userlist,setUserlist] = useState();
    const [patientlist,setPatientlist] = useState();
    const [form, setForm] = useState(initialState);
    const URL = 'http://localhost:5000';
    const { client } = useChatContext();

    useEffect(() => axios.get(`${URL}/all`).then((response)=>{
        setUserlist(response.data.result);
    }).catch(err => console.log(err)), []);

    const findArrayElementByTitle = (array, title) => {
        return array.find((element) => {
          return element.user_id === title;
        })
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        console.log(form)
    }


    
    useEffect(() => axios.get(`${URL}/Patients`).then((response)=>{
        setPatientlist(response.data.result);
    }).catch(err => console.log(err)), []);


    const updateinfo = (age, weight, height, bloodpressure, userid) =>{
        axios.put(`${URL}/update`, {
            age, weight, height, bloodpressure, userid,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let userid = findArrayElementByTitle(userlist,client.userID).user_id
        
        const age  = form.Age;
        const weight  = form.Weight;
        const height  = form.Height;
        const bloodpressure  = form.Blood_pressure;

        console.log(form)
        updateinfo(age, weight, height, bloodpressure,userid);

    }

    if(isCreating) {
        return (
            <div className="channel__container">
                <CreateChannel createType={createType} setIsCreating={setIsCreating} />
            </div>
        )
    }
    
    if(viewProfile){
        let user = findArrayElementByTitle(userlist,client.userID)
        if (user.isDoctor === 'Doctor'){
        return ( 
        <div className="channel__container">
        {patientlist.map((val, key) => {
            return (
            <div className="profile__container" key = {key}> 
                <h3> Name: {val.Full_name} </h3> 
                <h3> weight: {val.Weight} </h3>
                <h3> Height: {val.Height} </h3>
                <h3> Age: {val.Age} </h3>
                <h3> Blood pressure: {val.Blood_pressure} </h3>
            </div>
            )
        })}
        </div> 
        )
        } else if (user.isDoctor === 'Patient'){
            return (
            <div className="profile__container">
            <h3>Name: {user.Full_name}</h3>
            <form onSubmit={handleSubmit}>
                        <div className="auth__form-container_fields-content_input">
                            <h3 htmlFor="Age">Age</h3>
                                <input 
                                    name="Age" 
                                    type="text"
                                    placeholder="Age"
                                    onChange={handleChange}
                                    defaultValue = {user.Age}
                                />
                            </div>
                            <div className="auth__form-container_fields-content_input">
                            <h3 htmlFor="Weight">Weight</h3>
                                <input 
                                    name="Weight" 
                                    type="text"
                                    placeholder="Weight"
                                    onChange={handleChange}
                                    defaultValue = {user.Weight}
                                />
                            </div>
                            <div className="auth__form-container_fields-content_input">
                            <h3 htmlFor="Height">Height</h3>
                                <input 
                                    name="Height" 
                                    type="text"
                                    placeholder="Height"
                                    onChange={handleChange}
                                    defaultValue = {user.Height}
                                />
                            </div>
                            <div className="auth__form-container_fields-content_input">
                            <h3 htmlFor="Blood_pressure">Blood pressure</h3>
                                <input 
                                    name="Blood_pressure" 
                                    type="text"
                                    placeholder="Blood pressure"
                                    onChange={handleChange}
                                    defaultValue = {user.Blood_pressure}
                                />
                            </div>
                        <div className="auth__form-container_fields-content_button">
                            <button> update </button>
                        </div>
                    </form>
                    </div>
            )
        }
    }

    //if(isEditing) {
        //return (
            //<div className="channel__container">
                //<EditChannel setIsEditing={setIsEditing} />
            //</div> 
        //)
    //}

    const EmptyState = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history.</p>
            <p className="channel-empty__second">Send messages, attachments, links, emojis, and more!</p>
        </div>
    )

    return (
        <div className=" channel__container">
            <Channel
                EmptyStateIndicator={EmptyState}
                Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}
            >
                <ChannelInner setIsEditing={setIsEditing} />
            </Channel>
        </div>
    );
}

export default ChannelContainer;
