import * as express from 'express';

import AppointmentCtrl from './controllers/appointment';
import StyleCtrl from './controllers/style';
import UserCtrl from './controllers/user';
import Appointment from './models/appointment';
import Style from './models/style';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const appointmentCtrl = new AppointmentCtrl();
  const styleCtrl = new StyleCtrl();
  const userCtrl = new UserCtrl();

  // Appointments
  router.route('/appointments').get(appointmentCtrl.getAll);
  router.route('/appointments/count').get(appointmentCtrl.count);
  router.route('/appointment').post(appointmentCtrl.insert);
  router.route('/appointment/:id').get(appointmentCtrl.get);
  router.route('/appointment/:id').put(appointmentCtrl.update);
  router.route('/appointment/:id').delete(appointmentCtrl.delete);
  router.route('/appointments/:client').get(appointmentCtrl.GetAppointmentsByUser);
  router.route('/myappointments/:stylist').get(appointmentCtrl.GetMyAppointments);

  router.route('/messaging/:toaddrbody').get(appointmentCtrl.SendText);
  router.route('/price/:style').get(styleCtrl.GetPrice);
  router.route('/hour/:hour').get(appointmentCtrl.GetAppointmentsByHour);

  // Styles
  router.route('/styles').get(styleCtrl.getAll);
  router.route('/styles/count').get(styleCtrl.count);
  router.route('/style').post(styleCtrl.insert);
  router.route('/style/:id').get(styleCtrl.get);
  router.route('/style/:id').put(styleCtrl.update);
  router.route('/style/:id').delete(styleCtrl.delete);
  
  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);
  router.route('/users/:username').get(userCtrl.GetUserByUsername);
  router.route('/stylists').get(userCtrl.GetStylists);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
