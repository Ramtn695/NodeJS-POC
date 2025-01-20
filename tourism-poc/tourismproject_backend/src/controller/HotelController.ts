import * as express from "express";
import { validationResult } from "express-validator";

import { HotelService } from "../services/hotelService";
import { getAllHotelOrders } from "../services/orderService";

const hotelService = new HotelService();

export class HotelController {
  viewHotel = async (req, res: express.Response, next) => {
    let userId = req.headers.user;
    let hotelExist = await hotelService.getHotels({
      user: {
        id: parseInt(userId),
      },
    });
    if (hotelExist) {
      return res.status(200).json(hotelExist);
    }
    return res.status(400).json("No Hotel Available");
  };

  viewAllRooms = async (req, res: express.Response, next) => {
    let hotelId = +req.params.id;
    let userId = +req.headers.user;
    let roomExist = await hotelService.getAllRooms({
      where: {
        hotel: {
          hotel_id: hotelId,
        },
      },
    });
    if (roomExist) {
      return res.status(200).json(roomExist);
    }
    return res.status(400).json("No Rooms Available");
  };

  addRooms = async (req, res: express.Response, next) => {
    const fileType = ["image/jpg", "image/png", "image/jpeg"];
    if (fileType.findIndex((e) => e === req.file.mimetype) === -1) {
      return res
        .status(400)
        .send("Upload a image file with jpg /jpeg/png extensions");
    }
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    let roleId = parseInt(req.headers.role[0]);
    let room = {
      name: req.body.name,
      description: req.body.description,
      image: "http://localhost:8080/uploads/" + req.file.filename,
      cost: req.body.cost,
      maxPerson: req.body.maxPerson,
      hotel_id: req.body.hotel_id,
    };

    await hotelService.addNewRoom(room);
    res.status(200).json("Saved Successfull");
  };

  addHotel = async (req, res: express.Response, next) => {
    const fileType = ["image/jpg", "image/png", "image/jpeg"];
    let roleId = parseInt(req.headers.role[0]);
    let hotelExist = await hotelService.getHotels({
      hotel_name: req.body.hotel.name,
      user: req.body.hotel.user.id,
    });
    if (fileType.findIndex((e) => e === req.file.mimetype) === -1) {
      return res
        .status(400)
        .send("Upload a image file with jpg /jpeg/png extensions");
    }
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    if (hotelExist) {
      return res.status(400).json(hotelExist);
      next();
    } else {
      let hotel = {
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        license: req.body.license,
        image: "http://localhost:8080/uploads/" + req.file.filename,
        user: req.body.user.id,
      };
      await hotelService.addNewHotel(hotel);

      res.status(200).json("Saved Hotel Data / Awaiting Confirmation");
    }
  };

  hotelAdminAllOrders = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const roleId = +req.headers.role;
    let hotelOrderExist = await getAllHotelOrders();
    if (hotelOrderExist) {
      return res.status(200).json(hotelOrderExist);
    }
    return res.status(400).json("No Orders Exists...");
  };
}
