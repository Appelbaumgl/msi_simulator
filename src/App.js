import React, { Component } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core/';
import "./App.css"

class App extends Component {

    constructor() {
        super();
        this.state = {
            zoom: 15,
            popupOpen: false,
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
                <button className={"ChangeDataButton"} onClick={this.openPopup.bind(this)}>Change Data</button>
                <Dialog open={this.state.popupOpen}>
                    <DialogTitle>Service Tech Info</DialogTitle>
                    <DialogContent>
                        <div></div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closePopup.bind(this)}>
                            CLOSE
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    openPopup() {
        this.setState({ popupOpen: true })
    }

    closePopup() {
        this.setState({ popupOpen: false })
    }

}

export default App;
