import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import $ from 'jquery';
import ImageUploader from "../../components/ImageUploader";
import { useNavigate } from "react-router-dom";
import viagem from "../../assets/images/viagem.jpeg";
import { useObject } from '../../hooks/ObjectContext';
import { useTotal } from '../../hooks/PriceContext';
import { useUser } from '../../hooks/UserContext'
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import DocumentPdf from '../../components/DocumentPdf';
import formatCurrency from "../../utils/formatCurrency";

function Travel(props) {
    const [userImage, setUserImage] = useState(null);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [hours, setHours] = useState('');

    const navigate = useNavigate()
    const { putObjectData, deleteObjects, objectData } = useObject()
    const { putTotalData, totalData } = useTotal()
    const { userData } = useUser()


    function CreadtedTravel() {
        if (name.length <= 1 && location.length <= 1 && description.length <= 1 && price === 0) {
            props.notify('Prencha os dados')
        } else if (name.length <= 1) {
            props.notify('Prencha o nome do lugar')

        } else if (description.length <= 1) {
            props.notify('Prencha a descrição do lugar')

        } else if (location.length <= 1) {
            props.notify('Prencha a localização do lugar')

        } else if (price === 0) {
            props.notify('Prencha o valor do passeio')
        } else {
            let meuObjeto = JSON.parse(localStorage.getItem("meuObjeto")) || {};
            meuObjeto.dados = meuObjeto.dados || [];
            let idCounter = 1;
            if (meuObjeto.dados.length > 0) {
                idCounter = Math.max(...meuObjeto.dados.map((data) => data.id)) + 1;
            }
            meuObjeto.dados.push({
                id: idCounter,
                name: name,
                path: userImage,
                location: location,
                description: description,
                cost: price,
                date: date,
                hours: hours,
                status: 'confirm'
            });
            const sumAllItems = meuObjeto.dados.reduce((acc, current) => {
                return parseInt(current.cost) + acc
            }, 0)

            putTotalData(sumAllItems)
            putObjectData(meuObjeto)
            clearInputStates()
            $('#modal').toggle()
            props.successNotify('Destino adicionado!')
        }
    }

    function clearInputStates() {
        setDate('')
        setDescription("")
        setHours('')
        setLocation('')
        setUserImage(null)
        setPrice(0)
        setName('')
    }

    async function handleDownload(data, total, user) {
        const blob = await pdf(<DocumentPdf data={data} total={total} user={user} />).toBlob();
        saveAs(blob, 'meu_roteiro.pdf');


        setTimeout(() => {
            const jsonObject = {
                dados: data,
                user: user,
                total
            };

            const jsonString = JSON.stringify(jsonObject, null, 2);
            const jsonBlob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(jsonBlob);
            const link = document.createElement('a')
            link.href = url;
            link.download = "file.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 2000);


    };

    function Logout() {
        putObjectData(null)
        putTotalData(null)
        localStorage.clear()
        navigate('/')
    }


    return (
        <motion.div
            className="page-content"
            id='page-content'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="travel">
                <h2 style={{ marginTop: "90px" }}>{objectData && objectData.dados && objectData.dados.length !== 0 ? 'Oque está esperando? bora curtir!' : 'Monte seu roteiro'}</h2>
                <div className="travel-cards">
                    {objectData && objectData.dados && objectData.dados.length !== 0 ? objectData.dados.map((travel, id) => {
                        return (
                            <div>
                                <div key={`travel-card-${id}`} className='travel-card'>
                                    <span className='travel-status'>
                                        <span># {id + 1}</span>
                                        <span className='waiting'>
                                            {travel.date && travel.hours ? `${travel.date} - ${travel.hours}` : 'Dia e hora indefinido'}
                                        </span>
                                    </span>
                                    <div className="travel-destination">
                                        <img className="travel-path" src={travel.path ? travel.path : viagem} alt={travel.name} />
                                        <p><div className="airplane-icon"></div> {travel.name}</p>
                                        <p><div className="about-icon"></div> {travel.description}</p>
                                        <p><div className="location-icon"></div>{travel.location}</p>
                                        <p><div className="dollar-icon"></div>{formatCurrency(travel.cost)}</p>
                                    </div>
                                    <div className="travel-buttons">
                                        <button className="button logout" onClick={() => deleteObjects(travel.id)}>Deletar</button>
                                    </div>
                                </div>
                                <div className="arrow-down-icon " style={{ justifyContent: 'center', display: 'flex' }}></div>
                            </div>

                        )
                    }) :
                        <div className="travel-buttons">
                            <button className="button"
                                onClick={() => $('#modal').toggle()}
                            >Adicionar destino</button>
                            <button className="button logout" onClick={() => Logout()}>Sair</button>
                        </div>
                    }
                </div>
                {objectData && objectData.dados && objectData.dados.length !== 0 ?
                    <div className="travel-buttons">
                        <button className="button" onClick={() => $('#modal').toggle()}>Adicionar destino</button>
                        <button className="button download" onClick={() => handleDownload(objectData.dados, totalData, userData.user)}>Baixar roteiro</button>
                        <button className="button logout" onClick={() => Logout()}>Sair</button>
                    </div>
                    : ''}
            </div>
            <div className="modal" id='modal' style={{
                display: 'none'
            }}>
                <div className="modal-adjust">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div
                                className='close-icon'
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    $('#modal').toggle()
                                }}></div>
                            <div className="airplane-icon" style={{ display: 'flex' }}></div>
                        </div>
                        <div className="modal-body">
                            <div>
                                <p>Posso ver este lugar ?</p>
                                <ImageUploader  setUserImage={(base64) => setUserImage(base64)} image={userImage} />
                                <p>Qual o nome de paraiso?</p>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="input" type='text' />
                                <p>Me fala um pouco sobre, pfv!</p>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea" />
                                <p> Aonde fica?</p>
                                <input value={location} onChange={(e) => setLocation(e.target.value)} className="input" type='text' />
                                <p>Quanto vamos gastar em??</p>
                                <input value={price} onChange={(e) => setPrice(e.target.value)} className="input" type='number' />
                                <p>Qual dia ??</p>
                                <input value={date} onChange={(e) => setDate(e.target.value)} className="input" type='date' />
                                <p>Qual horario??</p>
                                <input value={hours} onChange={(e) => setHours(e.target.value)} className="input" type='time' />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button-modal" onClick={() => CreadtedTravel()}> Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div >
    );
}

export default Travel;