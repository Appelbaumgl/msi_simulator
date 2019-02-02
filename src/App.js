import React, { Component } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import "./App.css"

class App extends Component {

    constructor() {
        super();
        this.state = {
            isExtended: false,
            lat: 43.0440,
            lng: -87.9084,
            zoom: 15
        };
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        return (
            <div className="App">
                <Map className={"Map"} attributionControl={false} center={position} zoom={this.state.zoom}>
                    <TileLayer url="http://maps.servicepro10.com/{z}/{x}/{y}.png"/>
                    <Marker position={position}>
                    </Marker>
                </Map>
            </div>
        );
    }
}

export default App;
