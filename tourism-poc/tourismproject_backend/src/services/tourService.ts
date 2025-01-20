import {
  BANNER_DATA,
  REQUEST,
  REQUEST_DATA,
  TOUR,
  TOUR_DATA,
} from "../constants/db.constants";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";

export class TourService {
  tourRequests = async (limit: number, skip: number, search?: any) => {
    if (search === "") {
      const resultData = await TOUR_DATA.findAndCount({
        where: {
          status: false,
        },
        take: limit,
        skip: skip,
      });
      if (resultData[1] > 0) {
        return resultData;
      }
      return null;
    }
    const resultData = await TOUR_DATA.createQueryBuilder("tour")
      .innerJoinAndSelect("tour.user", "user")
      .innerJoinAndSelect("user.role", "role")
      .where("tour.package_name ILIKE :q or user.name ILIKE :q", {
        q: `%${search}%`,
      })
      .where("tour.status =:status", { status: false })
      .getMany();
    if (resultData.length > 0) {
      return resultData;
    }
    return null;
  };

  updateTourData = async (id: number, query) => {
    const resultData = await TOUR_DATA.update(id, query);
    return resultData;
  };

  getTours = async (query) => {
    const resultData = await TOUR_DATA.find(query);
    return resultData;
  };

  addNewTour = async (tourData) => {
    let tour = TOUR;
    tour.package_name = tourData.package_name;
    tour.from = tourData.from;
    tour.to = tourData.to;
    tour.tour_image = tourData.tour_image;
    tour.provider_license = tourData.provider_license;
    tour.description = tourData.description;
    tour.availablity = true;
    tour.status = false;
    tour.startDate = tourData.startDate;
    tour.endDate = tourData.endDate;
    tour.total_days = tourData.total_days;
    tour.max_person = 100;
    tour.cost = tourData.cost;
    tour.user = tourData.user;
    const response = await TOUR_DATA.save(tour);

    const message = `${response.user.name} has raised request to add ${tour.package_name}`;
    const type = "request_tour";
    const newNotification = new Notification();
    newNotification.notification = message;
    newNotification.type = type;
    await AppDataSource.manager.save(newNotification);

    let request = REQUEST;
    request.status = false;
    request.user = tour.user;
    await REQUEST_DATA.save(request);
  };

  getTourById = async (query) => {
    const resultData = await TOUR_DATA.findOneBy(query);
    return resultData;
  };

  deletePackage = async (id: number) => {
    const tourData = await TOUR_DATA.findOneBy({
      tour_id: id,
    });
    const bannerData = await BANNER_DATA.findOneBy({
      tour: {
        tour_id: id,
      },
    });
    const removeBanner = await BANNER_DATA.remove(bannerData);
    const response = await TOUR_DATA.remove(tourData);
    return response;
  };
}
