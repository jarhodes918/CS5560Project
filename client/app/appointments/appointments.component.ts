import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { AppointmentService } from '../services/appointment.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Appointment } from '../shared/models/appointment.model';
import { Style } from '../shared/models/style.model';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})

export class AppointmentsComponent implements OnInit {

  appointment = new Appointment();
  b4_edit_appointment = new Appointment();
  appointments: Appointment[] = [];
  style = new Style();
  styles: Style[] = [];
  stylists: User[] = [];
  current_user = new User();
  
  isAdmin = false;
  isLoading = false;
  isAppointmentEditing = false;
  isEditing = false;
  isStyleEditing = false;
  showstyles = false;

  addAppointmentForm: FormGroup;
  aclient = new FormControl('', Validators.required);
  adate = new FormControl('', Validators.required);
  atime = new FormControl('', Validators.required);

  addStyleForm: FormGroup;
  sname = new FormControl('', Validators.required);
  sprice = new FormControl('', Validators.required);

  constructor(private appointmentService: AppointmentService,
			  private auth: AuthService,              
              private formBuilder: FormBuilder,
              public toast: ToastComponent) { }

  ngOnInit() {
	  
    this.getAppts();
    this.getStyles();
    this.getStylists();
	
    this.addAppointmentForm = this.formBuilder.group({
      aclient: this.aclient,
      adate: this.adate,
      atime: this.atime
    });
	
    this.addStyleForm = this.formBuilder.group({
      sname: this.sname,
      sprice: this.sprice
    });
  }

  getAppts() {
    this.appointmentService.getUserByUsername(this.auth.currentUser.username).subscribe(
      data => {this.current_user = data; 
				if (this.current_user.role == "client") {this.getAppointments();};
				if (this.current_user.role == "stylist") {this.getMyAppointments();};
				if (this.current_user.role == "admin") {this.isAdmin = true; this.getAllAppointments();};
	  },
      error => console.log(error)
    );
  }

  SendText(appointment) {
    this.appointmentService.SendText('+1' + this.current_user.phone + '|' + this.current_user.email + '|' + 
	'Your appointment for a ' + appointment.style + ' with ' + appointment.stylist + ' is confirmed on ' 
	 + appointment.date + ' at ' + appointment.time + '.').subscribe(
      data => {},
      error => console.log(error)
    );  

    this.appointmentService.getUserByUsername(appointment.stylist).subscribe(
      data => { 

		this.appointmentService.SendText('+1' + data.phone + '|' + data.email + '|' + 
		appointment.client + ' has a confirmed appointment for a ' + appointment.style + ' with you on ' 
		 + appointment.date + ' at ' + appointment.time + '.').subscribe(
		  data => {},
		  error => console.log(error)
		);  
	  },
      error => console.log(error)
    );
	
  }

  SendEdit(appointment) {
    this.appointmentService.SendText('+1' + this.current_user.phone + '|' + this.current_user.email + '|' + 
	'Your appointment for a ' + this.b4_edit_appointment.style + ' with ' + this.b4_edit_appointment.stylist + ' on ' 
	 + this.b4_edit_appointment.date + ' at ' + this.b4_edit_appointment.time + ' has been modified.  The updated appointment is for a ' +
	 appointment.style + ' with ' + appointment.stylist + ' on ' + appointment.date + ' at ' + appointment.time).subscribe(
      data => {},
      error => console.log(error)
    );  

    this.appointmentService.getUserByUsername(this.b4_edit_appointment.stylist).subscribe(
      data => { 

		this.appointmentService.SendText('+1' + data.phone + '|' + data.email + '|' + 
		this.b4_edit_appointment.client + ' has modified the appointment for a ' + this.b4_edit_appointment.style + ' with you on ' 
		 + this.b4_edit_appointment.date + ' at ' + this.b4_edit_appointment.time + '.  The updated appointment is with ' + 
		 appointment.client + ' for a ' + appointment.style + ' on ' 
		 + appointment.date + ' at ' + appointment.time + '.').subscribe(
		  data => {},
		  error => console.log(error)
		);  
	  },
      error => console.log(error)
    );
	
  }
  
  SendCancel(appointment) {
    this.appointmentService.SendText('+1' + this.current_user.phone + '|' + this.current_user.email + '|' + 
	'Your appointment for a ' + appointment.style + ' with ' + appointment.stylist + ' on ' 
	 + appointment.date + ' at ' + appointment.time + ' has been cancelled.').subscribe(
      data => {},
      error => console.log(error)
    );  

    this.appointmentService.getUserByUsername(appointment.stylist).subscribe(
      data => { 

		this.appointmentService.SendText('+1' + data.phone + '|' + data.email + '|' + 
		appointment.client + ' has cancelled the appointment for a ' + appointment.style + ' with you on ' 
		 + appointment.date + ' at ' + appointment.time + '.').subscribe(
		  data => {},
		  error => console.log(error)
		);  
	  },
      error => console.log(error)
    );
	
  }
  
  getAppointments() {
    this.appointmentService.getAppointments(this.auth.currentUser.username).subscribe(
      data => {this.appointments = data;},
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getMyAppointments() {
    this.appointmentService.getMyAppointments(this.auth.currentUser.username).subscribe(
      data => {this.appointments = data;},
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getAllAppointments() {
    this.appointmentService.getAllAppointments().subscribe(
      data => {this.appointments = data;},
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getAppointment(userappointment) {
    this.appointmentService.getAppointmentByUser(userappointment).subscribe(
      data => this.appointment = data,
      error => console.log(error),
      () => this.isLoading = false
    );
	
  }

  addAppointment() {

	var appointment = new Appointment();
	var hourtest = document.getElementById("astylist")["value"] + "|" + this.addAppointmentForm.controls["adate"].value + "|" + 
		this.addAppointmentForm.controls["atime"].value.substring(0,2);
console.log("hour: " + hourtest);
	this.appointmentService.getAppointmentsByHour(hourtest).subscribe(
	  data => { console.log("hour: " + data);
	  if (data > 0) { alert("The selected stylist, date, and time is already booked.");}
	  else {
	this.appointmentService.getPrice(document.getElementById("astyle")["value"]).subscribe(
	  data => {console.log("price data: " + data); appointment.price = +data;
				appointment.style = document.getElementById("astyle")["value"];
				appointment.client = this.addAppointmentForm.controls["aclient"].value;
				appointment.stylist = document.getElementById("astylist")["value"];
				appointment.date = this.addAppointmentForm.controls["adate"].value;
				appointment.time = this.addAppointmentForm.controls["atime"].value;
				appointment.hour = appointment.time.substring(0,2);
				appointment.creator = this.auth.currentUser.username;
				
				console.log("in add: " + appointment.hour);	  
				
				var today = new Date();  
				var apptdate = new Date(this.addAppointmentForm.controls["adate"].value);

				console.log("appt_date: " + apptdate + " today: " + today);	  
				
				console.log(apptdate.getDay() + ":" + this.addAppointmentForm.controls["atime"].value.substring(0,2));
						
				if (today > apptdate || apptdate.getDay() == 6 || this.addAppointmentForm.controls["atime"].value.substring(0,2) < "09" || 
					this.addAppointmentForm.controls["atime"].value.substring(0,2) > "17") {
					alert("Please enter a day and time later than today and between Monday and Saturday from 9 am to 5 pm");
				}
				else {

					this.appointmentService.addAppointment(appointment).subscribe(
					  res => {
						this.appointments.push(res);
						this.addAppointmentForm.reset();
						this.toast.setMessage('item added successfully.', 'success');
						this.SendText(appointment);
						document.getElementById("astyle")["selectedIndex"] = "0";
						document.getElementById("astylist")["selectedIndex"] = "0";
						this.ngOnInit();
					  },
					  error => console.log(error)
					);
				}
	  },
      error => console.log(error)
    );
	  }},
      error => console.log(error)
	  );
  }

  enableAppointmentEditing(appointment: Appointment) {
	this.isEditing = true;
    this.isAppointmentEditing = true;
    this.appointment = appointment;
	this.b4_edit_appointment.client = appointment.client;
	this.b4_edit_appointment.style = appointment.style;
	this.b4_edit_appointment.price = appointment.price;
	this.b4_edit_appointment.stylist = appointment.stylist;
	this.b4_edit_appointment.date = appointment.date;
	this.b4_edit_appointment.time = appointment.time;
	this.b4_edit_appointment.creator = appointment.creator;
  }

  cancelAppointmentEditing() {
    this.isAppointmentEditing = false;
    this.isEditing = false;
    this.appointment = new Appointment();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the appointments to reset the editing
    this.ngOnInit();
  }

  editAppointment(appointment: Appointment) {

	  var today = new Date();  
	  var apptdate = new Date(appointment.date);
	  
  	if (today > apptdate || apptdate.getDay() == 6 || appointment.time.substring(0,2) < "09" || 
		appointment.time.substring(0,2) > "17") {
		alert("Please enter a day and time later than today and between Monday and Saturday from 9 am to 5 pm");
	}
	else {

		  this.appointmentService.editAppointment(appointment).subscribe(
		  () => {
			this.isAppointmentEditing = false;
			this.isEditing = false;
			this.appointment = appointment;
			this.toast.setMessage('item edited successfully.', 'success');
		    this.SendEdit(appointment);          
			this.ngOnInit();
		  },
		  error => console.log(error)
		);
	}
  }

  deleteAppointment(appointment: Appointment) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.appointmentService.deleteAppointment(appointment).subscribe(
        () => {		  
          const pos = this.appointments.map(elem => elem._id).indexOf(appointment._id);
          this.appointments.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
		  this.SendCancel(appointment);          
		  this.ngOnInit();
        },
        error => console.log(error)
      );
    }
  }
  
  getStyles() {
	  
     this.appointmentService.getStyles().subscribe(
      data => this.styles = data,
      error => console.log(error)
    );
  }
  
  getStylists() {
	  
     this.appointmentService.getStylists().subscribe(
      data => this.stylists = data,
      error => console.log(error)
    );
  }

  addStyle() {

	var style = new Style();

	style.name = this.addStyleForm.controls["sname"].value;
	style.price = this.addStyleForm.controls["sprice"].value;
	
	console.log(style);	 
 
    this.appointmentService.addStyle(style).subscribe(
      res => {
        this.styles.push(res);
        this.addStyleForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableStyleEditing(style: Style) {
	this.isEditing = true;
    this.isStyleEditing = true;
    this.style = style;
  }

  cancelStyleEditing() {
    this.isEditing = false;
    this.isStyleEditing = false;
    this.style = new Style();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the styles to reset the editing
    this.getStyles();
  }

  editStyle(style: Style) {
    this.appointmentService.editStyle(style).subscribe(
      () => {
        this.isEditing = false;
        this.isStyleEditing = false;
        this.style = style;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteStyle(style: Style) {

	console.log(style);	  

    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.appointmentService.deleteStyle(style).subscribe(
        () => {
          const pos = this.styles.map(elem => elem._id).indexOf(style._id);
          this.styles.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }
}
