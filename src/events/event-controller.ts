import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }



    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
          const sortBy = req.query.sortBy as string;
          const sortDirection = req.query.sortDirection as string;
          const {page = 1, limit = 10} = req.query;
          const count = await this.eventService.getEventsCount();

          const events = await this.eventService.getEvents(sortBy, sortDirection, +page, +limit);
          
          res.status(200).json({
            events, 
            totalPages: Math.ceil(count/+limit),
            currentPage: +page,
          });
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

    


    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default EventController;