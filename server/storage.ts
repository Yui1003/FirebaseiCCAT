import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  Building, InsertBuilding,
  Floor, InsertFloor,
  Room, InsertRoom,
  Staff, InsertStaff,
  Event, InsertEvent,
  Walkpath, InsertWalkpath,
  Drivepath, InsertDrivepath,
  AdminUser, InsertAdminUser,
  Setting, InsertSetting
} from "@shared/schema";

export interface IStorage {
  getBuildings(): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuilding(id: string, building: InsertBuilding): Promise<Building | undefined>;
  deleteBuilding(id: string): Promise<boolean>;

  getFloors(): Promise<Floor[]>;
  getFloor(id: string): Promise<Floor | undefined>;
  getFloorsByBuilding(buildingId: string): Promise<Floor[]>;
  createFloor(floor: InsertFloor): Promise<Floor>;
  updateFloor(id: string, floor: InsertFloor): Promise<Floor | undefined>;
  deleteFloor(id: string): Promise<boolean>;

  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  getRoomsByFloor(floorId: string): Promise<Room[]>;
  getRoomsByBuilding(buildingId: string): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: InsertRoom): Promise<Room | undefined>;
  deleteRoom(id: string): Promise<boolean>;

  getStaff(): Promise<Staff[]>;
  getStaffMember(id: string): Promise<Staff | undefined>;
  getStaffByBuilding(buildingId: string): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: InsertStaff): Promise<Staff | undefined>;
  deleteStaff(id: string): Promise<boolean>;

  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: InsertEvent): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  getWalkpaths(): Promise<Walkpath[]>;
  getWalkpath(id: string): Promise<Walkpath | undefined>;
  createWalkpath(walkpath: InsertWalkpath): Promise<Walkpath>;
  updateWalkpath(id: string, walkpath: InsertWalkpath): Promise<Walkpath | undefined>;
  deleteWalkpath(id: string): Promise<boolean>;

  getDrivepaths(): Promise<Drivepath[]>;
  getDrivepath(id: string): Promise<Drivepath | undefined>;
  createDrivepath(drivepath: InsertDrivepath): Promise<Drivepath>;
  updateDrivepath(id: string, drivepath: InsertDrivepath): Promise<Drivepath | undefined>;
  deleteDrivepath(id: string): Promise<boolean>;

  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;

  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  createSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(key: string, value: string): Promise<Setting | undefined>;

  exportToJSON(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getBuildings(): Promise<Building[]> {
    return await db.select().from(schema.buildings);
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    const result = await db.select().from(schema.buildings).where(eq(schema.buildings.id, id));
    return result[0];
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const result = await db.insert(schema.buildings).values(insertBuilding).returning();
    return result[0];
  }

  async updateBuilding(id: string, insertBuilding: InsertBuilding): Promise<Building | undefined> {
    const result = await db.update(schema.buildings).set(insertBuilding).where(eq(schema.buildings.id, id)).returning();
    return result[0];
  }

  async deleteBuilding(id: string): Promise<boolean> {
    await db.delete(schema.buildings).where(eq(schema.buildings.id, id));
    return true;
  }

  async getFloors(): Promise<Floor[]> {
    return await db.select().from(schema.floors);
  }

  async getFloor(id: string): Promise<Floor | undefined> {
    const result = await db.select().from(schema.floors).where(eq(schema.floors.id, id));
    return result[0];
  }

  async getFloorsByBuilding(buildingId: string): Promise<Floor[]> {
    return await db.select().from(schema.floors).where(eq(schema.floors.buildingId, buildingId));
  }

  async createFloor(insertFloor: InsertFloor): Promise<Floor> {
    const result = await db.insert(schema.floors).values(insertFloor).returning();
    return result[0];
  }

  async updateFloor(id: string, insertFloor: InsertFloor): Promise<Floor | undefined> {
    const result = await db.update(schema.floors).set(insertFloor).where(eq(schema.floors.id, id)).returning();
    return result[0];
  }

  async deleteFloor(id: string): Promise<boolean> {
    await db.delete(schema.floors).where(eq(schema.floors.id, id));
    return true;
  }

  async getRooms(): Promise<Room[]> {
    return await db.select().from(schema.rooms);
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const result = await db.select().from(schema.rooms).where(eq(schema.rooms.id, id));
    return result[0];
  }

  async getRoomsByFloor(floorId: string): Promise<Room[]> {
    return await db.select().from(schema.rooms).where(eq(schema.rooms.floorId, floorId));
  }

  async getRoomsByBuilding(buildingId: string): Promise<Room[]> {
    return await db.select().from(schema.rooms).where(eq(schema.rooms.buildingId, buildingId));
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const result = await db.insert(schema.rooms).values(insertRoom).returning();
    return result[0];
  }

  async updateRoom(id: string, insertRoom: InsertRoom): Promise<Room | undefined> {
    const result = await db.update(schema.rooms).set(insertRoom).where(eq(schema.rooms.id, id)).returning();
    return result[0];
  }

  async deleteRoom(id: string): Promise<boolean> {
    await db.delete(schema.rooms).where(eq(schema.rooms.id, id));
    return true;
  }

  async getStaff(): Promise<Staff[]> {
    return await db.select().from(schema.staff);
  }

  async getStaffMember(id: string): Promise<Staff | undefined> {
    const result = await db.select().from(schema.staff).where(eq(schema.staff.id, id));
    return result[0];
  }

  async getStaffByBuilding(buildingId: string): Promise<Staff[]> {
    return await db.select().from(schema.staff).where(eq(schema.staff.buildingId, buildingId));
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const result = await db.insert(schema.staff).values(insertStaff).returning();
    return result[0];
  }

  async updateStaff(id: string, insertStaff: InsertStaff): Promise<Staff | undefined> {
    const result = await db.update(schema.staff).set(insertStaff).where(eq(schema.staff.id, id)).returning();
    return result[0];
  }

  async deleteStaff(id: string): Promise<boolean> {
    await db.delete(schema.staff).where(eq(schema.staff.id, id));
    return true;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(schema.events);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(schema.events).where(eq(schema.events.id, id));
    return result[0];
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const result = await db.insert(schema.events).values(insertEvent).returning();
    return result[0];
  }

  async updateEvent(id: string, insertEvent: InsertEvent): Promise<Event | undefined> {
    const result = await db.update(schema.events).set(insertEvent).where(eq(schema.events.id, id)).returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<boolean> {
    await db.delete(schema.events).where(eq(schema.events.id, id));
    return true;
  }

  async getWalkpaths(): Promise<Walkpath[]> {
    return await db.select().from(schema.walkpaths);
  }

  async getWalkpath(id: string): Promise<Walkpath | undefined> {
    const result = await db.select().from(schema.walkpaths).where(eq(schema.walkpaths.id, id));
    return result[0];
  }

  async createWalkpath(insertWalkpath: InsertWalkpath): Promise<Walkpath> {
    const result = await db.insert(schema.walkpaths).values(insertWalkpath).returning();
    return result[0];
  }

  async updateWalkpath(id: string, insertWalkpath: InsertWalkpath): Promise<Walkpath | undefined> {
    const result = await db.update(schema.walkpaths).set(insertWalkpath).where(eq(schema.walkpaths.id, id)).returning();
    return result[0];
  }

  async deleteWalkpath(id: string): Promise<boolean> {
    await db.delete(schema.walkpaths).where(eq(schema.walkpaths.id, id));
    return true;
  }

  async getDrivepaths(): Promise<Drivepath[]> {
    return await db.select().from(schema.drivepaths);
  }

  async getDrivepath(id: string): Promise<Drivepath | undefined> {
    const result = await db.select().from(schema.drivepaths).where(eq(schema.drivepaths.id, id));
    return result[0];
  }

  async createDrivepath(insertDrivepath: InsertDrivepath): Promise<Drivepath> {
    const result = await db.insert(schema.drivepaths).values(insertDrivepath).returning();
    return result[0];
  }

  async updateDrivepath(id: string, insertDrivepath: InsertDrivepath): Promise<Drivepath | undefined> {
    const result = await db.update(schema.drivepaths).set(insertDrivepath).where(eq(schema.drivepaths.id, id)).returning();
    return result[0];
  }

  async deleteDrivepath(id: string): Promise<boolean> {
    await db.delete(schema.drivepaths).where(eq(schema.drivepaths.id, id));
    return true;
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const result = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
    return result[0];
  }

  async createAdmin(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const result = await db.insert(schema.admins).values(insertAdmin).returning();
    return result[0];
  }

  async getSettings(): Promise<Setting[]> {
    return await db.select().from(schema.settings);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await db.select().from(schema.settings).where(eq(schema.settings.key, key));
    return result[0];
  }

  async createSetting(insertSetting: InsertSetting): Promise<Setting> {
    const result = await db.insert(schema.settings).values(insertSetting).returning();
    return result[0];
  }

  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const existing = await this.getSetting(key);
    if (!existing) {
      return undefined;
    }
    const result = await db.update(schema.settings).set({ value }).where(eq(schema.settings.key, key)).returning();
    return result[0];
  }

  async exportToJSON(): Promise<void> {
    console.log('Export to JSON skipped - PostgreSQL is the source of truth');
  }
}

export const storage = new DatabaseStorage();
