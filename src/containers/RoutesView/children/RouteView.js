import React from 'react';
import {RouteCard, RouteDetail} from "./timelineroute.style";
import RouteVisualizer from "../../../components/RouteVisualizer/RouteVisualizer.component";
import Popup from "reactjs-popup";
import MediaLoader from "../../../utils/MediaLoader";
import ReactDOM from 'react-dom';
import {Button, Card} from "react-bootstrap";
import auth from 'solid-auth-client';
import {ShareRouteService} from "../Service";
import {successToaster} from '@utils';
import i18n from '../../../i18n';
import {NotificationTypes} from '@inrupt/solid-react-components';


export const RouteView = props => {
    const {data} = props;
    //const {shareRoute} = props;
    const {sendNot}=props;
    var ruta = data.ruta;
    var friends = data.friends;
    let comentario = "";

    function verMultimedia() {
        const loader = new MediaLoader();
        const img = document.querySelector('#img');
        ReactDOM.render(<p>Media no disponible</p>, img);
        loader.loadMedia(ruta.getImg(), function (file) {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(file);
            const img = document.querySelector('#img');
            ReactDOM.render(<img src={imageUrl} alt={"foto" + ruta.fileName} width="500" height="500"/>, img);
        });
    }

    function addComment() {
        if (comentario !== "") {
            let date = new Date();
            ruta.comments.push({
                comment: {
                    text: comentario,
                    createdAt: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay()
                }
            });
            comentario = "";
            comments();
            const domContainer = document.querySelector('#input-comentario');
            domContainer.value = "";
        } else {
            alert("El comentario esta vacío")
        }
    }

    function handleCommentChange(event) {
        event.preventDefault();
        comentario = event.target.value;
    }

    function comments() {
        if (ruta.comments.length !== 0) {
            let commentarios = [];
            for (let i = 0; i < ruta.comments.length; i++) {
                commentarios.push(<Card><Card.Body> <Card.Title>{ruta.comments[i].comment.text}</Card.Title>
                    <footer className="blockquote-footer"> Publicado
                        el: {ruta.comments[i].comment.createdAt}</footer>
                </Card.Body> </Card>)
            }
            const domContainer = document.querySelector('#comentarios');
            ReactDOM.render(commentarios, domContainer);
        } else {
            const domContainer = document.querySelector('#comentarios');
            ReactDOM.render(<Card><Card.Body><Card.Title>No hay comentarios en esta
                ruta</Card.Title></Card.Body></Card>, domContainer);
        }
    }

    async function shareRoute(friendWebID){
        try {
            var session = await auth.currentSession();

            const contentNotif = {
                title: "Route share",
                summary: "has shared you a route.",
                actor: session.webId,
                object: ruta.webId,
                target: friendWebID
            };
            console.log(await ShareRouteService.publish(sendNot.sendNotification, contentNotif, friendWebID, NotificationTypes.OFFER,ruta));

            console.log("se supone que subido");
            successToaster(i18n.t('routeView.shareRouteGood','Great'));
        } catch (error) {
            console.log(error);
            alert("Could not share the route");
        }
    }

    return (
        <RouteCard className="card">
            <RouteDetail data-testid="welcome-detail">
                <div className="modal">
                    <br></br>
                    <Popup
                        trigger={<button className="button"> {ruta.name} </button>}
                        modal
                        closeOnDocumentClick
                    >
                        <span className="map"> <RouteVisualizer ruta={ruta}></RouteVisualizer></span>
                        <div id={"img"}></div>
                        <p><br></br></p><p><br></br></p><p><br></br></p><p><br></br></p><p><br></br></p>
                        <p><br></br></p><p><br></br></p><p><br></br></p><p><br></br></p><p><br></br></p>
                        <p><br></br></p><p><br></br></p><p><br></br></p><p><br></br></p><p><br></br></p>


                    </Popup>
                    <Popup
                        trigger={<button className="button"> <img src="../../../../img/icon/addRoute.svg" width="20px"
                                                                  alt="x"/> </button>}
                        modal
                        closeOnDocumentClick
                    >
                        <p><br></br></p><p><br></br></p>
                        <button className="button" onClick={() => verMultimedia()}>{i18n.t('routeView.viewMedia')}</button>
                        <p></p>
                        <div id={"img"}></div>
                        <p><br></br></p>
                    </Popup>
                    <Popup
                        trigger={<button className="button"><img src="../../../../img/icon/share.svg" width="20px"
                                                                 alt="x"/></button>}
                        modal
                        closeOnDocumentClick>
                        <h3>{i18n.t('routeView.selectFriend')}</h3>
                        <div>
                            {friends.map((friend) => (
                                <p><Button onClick={()=>shareRoute(friend.webId)}
                                           key={friend.webId}>{friend.name}</Button>
                                </p>))}
                        </div>
                        <p><br></br></p>
                    </Popup>
                </div>
            </RouteDetail>
        </RouteCard>

    );
};