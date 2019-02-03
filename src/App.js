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
                Address: undefined,
                ScheduledDateTime: undefined,
                AppointmentNumber: undefined,
                Notes: undefined
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
                <Dialog 
                    open={this.state.popupOpen}
                    fullWidth = {true}
                    maxWidth = {"sm"}
                >
                    <DialogTitle>Service Tech Info</DialogTitle>
                    <DialogContent>
                        <div>
                            <div className={"Title"}>Appointment</div>
                            <div className={"Input"}>
                                <div className={"InputLeft"}>Address</div>
                                <input className={"InputRight"} type="text" value={this.state.Appointment.Address}/>
                            </div>
                            <div className={"Input"}>
                                <div className={"InputLeft"}>Scheduled Date Time</div>
                                <input className={"InputRight"} type="datetime-local" value={this.state.Appointment.ScheduledDateTime}/>
                            </div>
                            <div className={"Input"}>
                                <div className={"InputLeft"}>Appointment Number</div>
                                <input className={"InputRight"} type="text" value={this.state.Appointment.AppointmentNumber}/>
                            </div>
                            <div className={"Input"}>
                                <div className={"InputLeft"}>Notes</div>
                                <input className={"InputRight"} type="text" value={this.state.Appointment.Notes}/>
                            </div>
                            <div className={"Title"}>Service Tech</div>
                            <div className={"Input"}>
                                <div className={"InputLeft"}></div>
                                <input className={"InputRight"} type="text"/>
                            </div>
                            <div className={"Title"}>Company</div>
                            <div className={"Input"}>
                                <div className={"InputLeft"}></div>
                                <input className={"InputRight"} type="text"/>
                            </div>
                        </div>
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
