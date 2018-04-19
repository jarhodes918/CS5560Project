import Style from '../models/style';
import BaseCtrl from './base';

export default class StyleCtrl extends BaseCtrl {
  model = Style;

    // Get price
    GetPrice = (req, res) => {
		console.error("style sent in: " + req.params.style);
      this.model.findOne({ name: req.params.style }, (err, item) => {
        if (err) { return console.error(err); }
		console.error("price returned: " + item.price);
		  return res.status(200).json(item.price);
      });
    }
  
	// Get Styles By User
	GetStylesByUser = (req, res) => {
		this.model.find({ creator: req.params.user }, (err, docs) => 
			{
				if (err) {return console.error(err);}
				res.status(200).json(docs);
			}
		);
	}	
	
  // Get id of one style by user
  GetStyleByUser = (req, res) => {
    this.model.findOne({ creator: req.params.userstyle.split("-")[0], name: req.params.userstyle.split("-")[1] }, (err, item) => {
      if (err) { return console.error(err); }
		return res.status(200).json(item);
    });
  }

  DeleteStyleByUser = (req, res) => {
    this.model.remove({ creator: req.params.userstyle.split("-")[0], name: req.params.userstyle.split("-")[1] }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
  
}
