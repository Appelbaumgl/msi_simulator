import React, { Component } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import "./App.css"

class App extends Component {

    constructor() {
        super();
        this.state = {
            zoom: 15,
            Appointment: {
                Latitude: 43.0440,
                Longitude: -87.9084,
            },
            ServiceTech: {
                Latitude: 43.0440,
                Longitude: -87.9084,
            },
            Company: {

            }
        };
    }

    render() {
        return (
            <div className="App">
                <Map className={"Map"} attributionControl={false} center={[this.state.Appointment.Latitude, this.state.Appointment.Longitude]} zoom={this.state.zoom}>
                    <TileLayer url="http://maps.servicepro10.com/{z}/{x}/{y}.png"/>
                    <Marker position={[this.state.ServiceTech.Latitude, this.state.ServiceTech.Longitude]} draggable={true}>
                    </Marker>
                </Map>
                <button className={"ChangeDataButton"}>Change Data</button>
            </div>
        );
    }
}

export default App;
