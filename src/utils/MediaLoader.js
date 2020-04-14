import SolidAuth from "solid-auth-client";
import auth from "solid-auth-client";
import FC from "solid-file-client";

class MediaLoader {

    saveImage(url, file) {
        console.log(url + " Comenzando subida")
        SolidAuth.fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': 'image/png'
            }
        });
        console.log("img subida")
    }

    loadMedia(url, callback) { // explicacion debajo !!
        const fc = new FC(auth);
        let content = fc.readFile( url );
        content.then(value => callback(value));
    }

    

}

export default MediaLoader;