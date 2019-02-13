import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core/';
import "./App.css"

class App extends Component {

    apiUrl = "https://localhost:44352/api";
    headers = {
        "API-Key": "apikeytest",
        "Content-Type": "application/json"
    }

    constructor() {
        super();
        this.state = {
            zoom: 15,
            popupOpen: false,
            Appointment: {
                Latitude: 0,
                Longitude: 0
            },
            ServiceTech: {
                Latitude: 0,
                Longitude: 0
            },
            Company:{}
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var url = window.location.href;
        var appointmentId = url.slice(url.lastIndexOf("/") + 1);

        fetch(`${this.apiUrl}/Appointment/${appointmentId}`)
            .then(appointment => appointment.json())
            .then((appointment) => {
                this.setState({ Appointment: appointment });

                fetch(`${this.apiUrl}/ServiceTech/${appointment.ServiceTechId}`)
                    .then(serviceTech => serviceTech.json())
                    .then((serviceTech) => {
                        this.setState({ ServiceTech: serviceTech });

                        fetch(`${this.apiUrl}/Company/${serviceTech.CompanyId}`)
                            .then(company => company.json())
                            .then((company) => {
                                this.setState({ Company: company });
                            });
                    });
            });
    }

    initializeServiceTechMarker = (ref) => {
        this.initializeMarker("ServiceTech", ref);
    }

    initializeAppointmentMarker = (ref) => {
        this.initializeMarker("Appointment", ref);
    }

    initializeMarker(entity, ref) {
        if (ref) {
            ref.leafletElement.on("dragend", (e) => {
                var latLng = e.target.getLatLng();

                fetch(`${this.apiUrl}/${entity}/${this.state[entity].Id}`, {
                    method: "PATCH",
                    headers: this.headers,
                    body: JSON.stringify([
                        {
                            op: "replace",
                            path: "Latitude",
                            value: latLng.lat
                        },
                        {
                            op: "replace",
                            path: "Longitude",
                            value: latLng.lng
                        }
                    ])
                });
            });
        }
    }

    render() {
        return (
            <div className="App">
                <Map className={"Map"} attributionControl={false} center={[this.state.Appointment.Latitude, this.state.Appointment.Longitude]} zoom={this.state.zoom}>
                    <TileLayer url="http://maps.servicepro10.com/{z}/{x}/{y}.png"/>
                    <Marker
                        ref={this.initializeServiceTechMarker}
                        position={[this.state.ServiceTech.Latitude, this.state.ServiceTech.Longitude]}
                        draggable={true}
                    >
                        <Popup>
                            Service Tech
                        </Popup>
                    </Marker>
                    <Marker
                        ref={this.initializeAppointmentMarker}
                        position={[this.state.Appointment.Latitude, this.state.Appointment.Longitude]}
                        draggable={true}
                    >
                        <Popup>
                            Appointment
                        </Popup>
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
                            <div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Address</div>
                                    {this.createInput("Appointment", "Address", "text")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Service Tech Rating</div>
                                    {this.createInput("Appointment", "ServiceTechRating", "number")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Scheduled Date Time</div>
                                    {this.createInput("Appointment", "ScheduledDateTime", "datetime-local")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Appointment Number</div>
                                    {this.createInput("Appointment", "AppointmentNumber", "text")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Notes</div>
                                    {this.createInput("Appointment", "Notes", "text")}
                                </div>
                            </div>
                            <div className={"Title"}>Service Tech</div>
                            <div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Vehicle Description</div>
                                    {this.createInput("ServiceTech", "VehicleDescription", "text")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Vehicle Picture Link</div>
                                    {this.createInput("ServiceTech", "VehiclePictureLink", "url")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Picture Link</div>
                                    {this.createInput("ServiceTech", "PictureLink", "url")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Email Address</div>
                                    {this.createInput("ServiceTech", "EmailAddress", "email")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Phone Number</div>
                                    {this.createInput("ServiceTech", "PhoneNumber", "tel")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Name</div>
                                    {this.createInput("ServiceTech", "Name", "text")}
                                </div>
                            </div>
                            <div className={"Title"}>Company</div>
                            <div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Logo Link</div>
                                    {this.createInput("Company", "LogoLink", "url")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Name</div>
                                    {this.createInput("Company", "Name", "text")}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.closePopup(true); }}>
                            Update
                        </Button>
                        <Button onClick={() => { this.closePopup(false); }}>
                            CLOSE
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    createInput(table, column, type) {
        var className = "InputRight";
        var value = this.state[table][column] || "";
        var onChange = (e) => {
            var entity = this.state[table]
            entity[column] = e.target.value;
            this.setState({ [table]: entity });
        };

        return <input className={className} type={type} value={value} onChange={onChange}/>
    }

    openPopup() {
        this.priorState = this.state;
        this.setState({ popupOpen: true });
    }

    closePopup(update) {
        if (update) {
            this.updateEntities();
        } else {
            Object.keys(this.priorState).forEach((key) => {
                this.setState({ [key]: this.priorState[key] });
            });
        }

        this.setState({ popupOpen: false });
    }

    updateEntities() {
        var appointmentPatches = [];
        var serviceTechPatches = [];
        var companyPatches = [];

        Object.keys(this.state.Appointment).forEach((key) => {
            appointmentPatches.push({
                op: "replace",
                path: key,
                value: this.state.Appointment[key]
            });
        });

        Object.keys(this.state.ServiceTech).forEach((key) => {
            serviceTechPatches.push({
                op: "replace",
                path: key,
                value: this.state.ServiceTech[key]
            });
        });

        Object.keys(this.state.Company).forEach((key) => {
            companyPatches.push({
                op: "replace",
                path: key,
                value: this.state.Company[key]
            });
        });
        
        fetch(`${this.apiUrl}/Appointment/${this.state.Appointment.Id}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(appointmentPatches)
        });

        fetch(`${this.apiUrl}/ServiceTech/${this.state.ServiceTech.Id}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(serviceTechPatches)
        });

        fetch(`${this.apiUrl}/Company/${this.state.Company.Id}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(companyPatches)
        });
    }

}

export default App;
