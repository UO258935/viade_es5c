import React, {Component} from "react";
import data from "@solid/query-ldflex";
import FriendRoute from "./friendroute.component";
import {getRouteShareByFriend} from "./Service/friendrouteService";
import {fetchDocument} from "tripledoc";
import {schema} from "rdf-namespaces";
import Point from "../../entities/Point";
import Route from "../../entities/Route";
import Media from "../../entities/Media";
import FC from "solid-file-client";
import JsonldToRouteParser from "../../parseo/parser/parserToRoute/parserJsonLd";


const auth = require('solid-auth-client');

export class FriendrouteContainer extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            routes: []
        }

    }

    componentDidMount() {
        const {webId} = this.props;
        if (webId) {
            this.getFriends();
        }
    }

    componentDidUpdate(prevProps) {
        const {webId} = this.props;
        if (webId && webId !== prevProps.webId) {
            this.getFriends();
        }
    }

    getFriends = async () => {
        this.setState({isLoading: true});
        const {webId} = this.props;
        const user = data[webId];
        let friends = [];

        for await (const friend of user.friends) {
            const friendWebId = await friend.value;
            const friend_data = data[friendWebId];
            const name = await friend_data.name;
            var information = {
                "webId": friendWebId,
                "name": name.toString()
            }
            friends.push(information);
        }
        this.setState({friends: friends});
    }

    getRoutesSharedWithMe = async (friendWebId) => {

        this.setState({isLoading: true});
        const {webId} = this.props;
        //const user = data[webId];

        let routes = []

        /*for await (const friend of user.friends) {
            routes = await getRouteShareByFriend(webId, friendWebId)
        }*/

        routes = await getRouteShareByFriend(webId, friendWebId);

        if (routes.length !== 0) {
            var ruta = []
            for (let x = 0; x < routes.length; x++) {
                ruta.push(routes[x]);
            }
        }

        var rutas = [];

        for await (const route of routes) {
            let tipo=route.split(".");
            if (tipo[tipo.length-1]==="jsonld"){
                var jsonFriend;
                // eslint-disable-next-line
                await getJSON(ruta).then(function (result) {
                jsonFriend = result;
                });
                let parser=new JsonldToRouteParser(jsonFriend);
                let ruta=parser.parse();
                ruta.setWebId(ruta);
                rutas.push(ruta);
            }else{
                var routeDocument;
                
                // eslint-disable-next-line
                await fetchDocument(Object(route)).then((content) => {
                    routeDocument = content;
                    // eslint-disable-next-line
                }).catch(err => routeDocument = null);

                if (routeDocument != null) {
                    const route = routeDocument.getSubject("http://example.org/myRoute");
                    const points = route.getAllLocalSubjects('http://arquisoft.github.io/viadeSpec/point');
                    const refs = route.getAllRefs('http://arquisoft.github.io/viadeSpec/hasMediaAttached');

                    var medias = [];

                    if (refs.length > 0) {
                        for (let i = 0; i < refs.length; i++) {
                            let ref = routeDocument.getSubject(refs[i]);
                            let fechaMedia = ref.getDateTime(schema.publishedDate);
                            let autor = data[ref.getRef(schema.author)];
                            let image = ref.getRef(schema.contentUrl);
                            let imagedoc=await this.getMedia(image);
                            let tipo=imagedoc.type.split('/')[0];
                            if (tipo==="image"){
                                medias.push(new Media(image, autor.value, fechaMedia, "image"));
                            }else if (tipo==="video"){
                                medias.push(new Media(image, autor.value, fechaMedia, "video"));
                            }

                        }
                    }

                    let pointsArray = [];
                    points.forEach(point =>
                        pointsArray.push(new Point(point.getDecimal(schema.latitude), point.getDecimal(schema.longitude))));

                    if (route.getString(schema.name) !== null) {
                        let ruta = new Route(route.getString(schema.name), pointsArray, route.getString(schema.description));
                        ruta.setWebId(route);
                        ruta.setMedia(medias);
                        rutas.push(ruta);
                    }
                }
            }
            
        }
        this.setState({routes: rutas});
    };
    
    async getMedia(image) {
        const fc = new FC(auth);
        if (await fc.itemExists(image)) {
            return await fc.readFile(image);
        }
    }

    render() {
        const {friends, routes} = this.state;
        const see = {
            getRoutesSharedWithMe: this.getRoutesSharedWithMe.bind(this)
        };
        return (
            <FriendRoute {...{friends, routes, see}} />
        );
    }
}

export const getJSON = async (jsonUrl) => {
    const fc = new FC(auth);
    return await fc.readFile(jsonUrl);
    
}