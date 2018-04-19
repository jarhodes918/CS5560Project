import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Appointment } from '../shared/models/appointment.model';
import { Style } from '../shared/models/style.model';
import { User} from '../shared/models/user.model';

@Injectable()
export class AppointmentService {

  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('/api/appointments');
  }

  getAppointmentsByHour(hour): Observable<number> {
    return this.http.get<number>('/api/hour/' + hour);
  }
  
  getPrice(style): Observable<number> {
    return this.http.get<number>('/api/price/' + style);
  }
  
  SendText(toaddrbody): Observable<number> {
    return this.http.get<number>('/api/messaging/' + toaddrbody);
  }
  
  getAppointments(client): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('/api/appointments/' + client);
  }

  getMyAppointments(stylist): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('/api/myappointments/' + stylist);
  }

  countAppointments(): Observable<number> {
    return this.http.get<number>('/api/appointments/count');
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>('/api/appointment', appointment);
  }

  getAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.get<Appointment>(`/api/appointment/${appointment._id}`);
  }

  getAppointmentByUser(userclient): Observable<Appointment> {
    return this.http.get<Appointment>('/api/appointment/get/' + userclient);
  }

  editAppointment(appointment: Appointment): Observable<string> {
    return this.http.put(`/api/appointment/${appointment._id}`, appointment, { responseType: 'text' });
  }

  deleteAppointment(appointment: Appointment): Observable<string> {
    return this.http.delete(`/api/appointment/${appointment._id}`, { responseType: 'text' });
  }

  getStyles(): Observable<Style[]> {
    return this.http.get<Style[]>('/api/styles');
  }

  getStylists(): Observable<User[]> {
    return this.http.get<User[]>('/api/stylists');
  }
  
  countStyles(): Observable<number> {
    return this.http.get<number>('/api/styles/count');
  }

  addStyle(style: Style): Observable<Style> {
    return this.http.post<Style>('/api/style', style);
  }

  getStyle(style: Style): Observable<Style> {
    return this.http.get<Style>(`/api/style/${style._id}`);
  }

  editStyle(style: Style): Observable<string> {
    return this.http.put(`/api/style/${style._id}`, style, { responseType: 'text' });
  }

  deleteStyle(style: Style): Observable<string> {
    return this.http.delete(`/api/style/${style._id}`, { responseType: 'text' });
  }

  getUserByUsername(username): Observable<User> {
    return this.http.get<User>('/api/users/' + username);
  }
}
