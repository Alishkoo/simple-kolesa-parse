import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { Event } from './types/response';



// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

    async getEventsCount(): Promise<number> {
      return EventModel.countDocuments();
    }

    async getEvents(sortBy: string = "name", sortDirection: string = "asc", page: number, limit: number): Promise<IEvent[]> {
      const sortOptions = {};
      sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
      return await EventModel.find().limit(limit * 1).skip((page - 1) * limit).sort(sortOptions).exec(); 
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, location ,duration, city} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        location,
        duration, 
        city
      });
  
      await newEvent.save();
      return newEvent;
    }
  
    
  }
  
  export default EventService;
  