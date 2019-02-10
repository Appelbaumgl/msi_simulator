import React, { Component } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
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
            Appointment_Latitude: 0,
            Appointment_Longitude: 0,
            ServiceTech_Latitude: 0,
            ServiceTech_Longitude: 0
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
                this.updateState("Appointment", appointment);

                fetch(`${this.apiUrl}/ServiceTech/${appointment.ServiceTechId}`)
                    .then(serviceTech => serviceTech.json())
                    .then((serviceTech) => {
                        this.updateState("ServiceTech", serviceTech);

                        fetch(`${this.apiUrl}/Company/${serviceTech.CompanyId}`)
                            .then(company => company.json())
                            .then((company) => {
                                this.updateState("Company", company);
                            });
                    });
            });
    }

    updateState(entity, data) {
        var keys = Object.keys(data);
        keys.forEach((key) => {
            this.setState({ [`${entity}_${key}`]: data[key] || "" });
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

                fetch(`${this.apiUrl}/${entity}/${this.state[`${entity}_Id`]}`, {
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
                <Map className={"Map"} attributionControl={false} center={[this.state.Appointment_Latitude, this.state.Appointment_Longitude]} zoom={this.state.zoom}>
                    <TileLayer url="http://maps.servicepro10.com/{z}/{x}/{y}.png"/>
                    <Marker
                        ref={this.initializeServiceTechMarker}
                        position={[this.state.ServiceTech_Latitude, this.state.ServiceTech_Longitude]}
                        draggable={true}
                    />
                    <Marker
                        ref={this.initializeAppointmentMarker}
                        position={[this.state.Appointment_Latitude, this.state.Appointment_Longitude]}
                        draggable={true}
                    />
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
                                    {this.createInput("Appointment_Address", "text")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Service Tech Rating</div>
                                    {this.createInput("Appointment_ServiceTechRating", "number")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Scheduled Date Time</div>
                                    {this.createInput("Appointment_ScheduledDateTime", "datetime-local")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Appointment Number</div>
                                    {this.createInput("Appointment_AppointmentNumber", "text")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Notes</div>
                                    {this.createInput("Appointment_Notes", "text")}
                                </div>
                            </div>
                            <div className={"Title"}>Service Tech</div>
                            <div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Vehicle Description</div>
                                    {this.createInput("ServiceTech_VehicleDescription", "text")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Vehicle Picture Link</div>
                                    {this.createInput("ServiceTech_VehiclePictureLink", "url")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Picture Link</div>
                                    {this.createInput("ServiceTech_PictureLink", "url")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Email Address</div>
                                    {this.createInput("ServiceTech_EmailAddress", "email")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Phone Number</div>
                                    {this.createInput("ServiceTech_PhoneNumber", "tel")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Name</div>
                                    {this.createInput("ServiceTech_Name", "text")}
                                </div>
                            </div>
                            <div className={"Title"}>Company</div>
                            <div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Logo Link</div>
                                    {this.createInput("Company_LogoLink", "url")}
                                </div>
                                <div className={"Input"}>
                                    <div className={"InputLeft"}>Name</div>
                                    {this.createInput("Company_Name", "text")}
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

    createInput(property, type) {
        var className = "InputRight";
        var value = this.state[property];
        var onChange = (e) => {
            this.setState({ [property]: e.target.value });
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

        Object.keys(this.state).forEach((key) => {
            var split = key.split("_");
            if (split.length > 1 && split[1] !== "Id") {
                var entity = split[0];
                var column = split[1];

                switch (entity) {
                    case "Appointment":
                        if (this.state[key]) {
                            appointmentPatches.push({
                                op: "replace",
                                path: column,
                                value: this.state[key]
                            });
                        }
                        break;
                    case "ServiceTech":
                        if (this.state[key]) {
                            serviceTechPatches.push({
                                op: "replace",
                                path: column,
                                value: this.state[key]
                            });
                        }
                        break;
                    case "Company":
                        if (this.state[key]) {
                            companyPatches.push({
                                op: "replace",
                                path: column,
                                value: this.state[key]
                            });
                        }
                        break;
                    default: 
                        break;
                };
            }
        });

        fetch(`${this.apiUrl}/Appointment/${this.state.Appointment_Id}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(appointmentPatches)
        });

        fetch(`${this.apiUrl}/ServiceTech/${this.state.ServiceTech_Id}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(serviceTechPatches)
        });

        fetch(`${this.apiUrl}/Company/${this.state.Company_Id}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(companyPatches)
        });
    }

}

export default App;
