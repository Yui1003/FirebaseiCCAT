import { randomUUID } from "crypto";
import { db } from "./db";
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
  // Buildings
  getBuildings(): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuilding(id: string, building: InsertBuilding): Promise<Building | undefined>;
  deleteBuilding(id: string): Promise<boolean>;

  // Floors
  getFloors(): Promise<Floor[]>;
  getFloor(id: string): Promise<Floor | undefined>;
  getFloorsByBuilding(buildingId: string): Promise<Floor[]>;
  createFloor(floor: InsertFloor): Promise<Floor>;
  updateFloor(id: string, floor: InsertFloor): Promise<Floor | undefined>;
  deleteFloor(id: string): Promise<boolean>;

  // Rooms
  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  getRoomsByFloor(floorId: string): Promise<Room[]>;
  getRoomsByBuilding(buildingId: string): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: InsertRoom): Promise<Room | undefined>;
  deleteRoom(id: string): Promise<boolean>;

  // Staff
  getStaff(): Promise<Staff[]>;
  getStaffMember(id: string): Promise<Staff | undefined>;
  getStaffByBuilding(buildingId: string): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: InsertStaff): Promise<Staff | undefined>;
  deleteStaff(id: string): Promise<boolean>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: InsertEvent): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Walkpaths
  getWalkpaths(): Promise<Walkpath[]>;
  getWalkpath(id: string): Promise<Walkpath | undefined>;
  createWalkpath(walkpath: InsertWalkpath): Promise<Walkpath>;
  updateWalkpath(id: string, walkpath: InsertWalkpath): Promise<Walkpath | undefined>;
  deleteWalkpath(id: string): Promise<boolean>;

  // Drivepaths
  getDrivepaths(): Promise<Drivepath[]>;
  getDrivepath(id: string): Promise<Drivepath | undefined>;
  createDrivepath(drivepath: InsertDrivepath): Promise<Drivepath>;
  updateDrivepath(id: string, drivepath: InsertDrivepath): Promise<Drivepath | undefined>;
  deleteDrivepath(id: string): Promise<boolean>;

  // Admin
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;

  // Settings
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  createSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(key: string, value: string): Promise<Setting | undefined>;

  // Backup/Export
  exportToJSON(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Buildings
  async getBuildings(): Promise<Building[]> {
    const snapshot = await db.collection('buildings').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Building));
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    const doc = await db.collection('buildings').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Building;
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const id = randomUUID();
    const building = { ...insertBuilding, id, markerIcon: insertBuilding.markerIcon || "building" } as Building;
    await db.collection('buildings').doc(id).set(building);
    return building;
  }

  async updateBuilding(id: string, insertBuilding: InsertBuilding): Promise<Building | undefined> {
    const building = { ...insertBuilding, id, markerIcon: insertBuilding.markerIcon || "building" } as Building;
    await db.collection('buildings').doc(id).set(building);
    return building;
  }

  async deleteBuilding(id: string): Promise<boolean> {
    await db.collection('buildings').doc(id).delete();
    return true;
  }

  // Floors
  async getFloors(): Promise<Floor[]> {
    const snapshot = await db.collection('floors').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor));
  }

  async getFloor(id: string): Promise<Floor | undefined> {
    const doc = await db.collection('floors').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Floor;
  }

  async getFloorsByBuilding(buildingId: string): Promise<Floor[]> {
    const snapshot = await db.collection('floors').where('buildingId', '==', buildingId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor));
  }

  async createFloor(insertFloor: InsertFloor): Promise<Floor> {
    const id = randomUUID();
    const floor = { ...insertFloor, id } as Floor;
    await db.collection('floors').doc(id).set(floor);
    return floor;
  }

  async updateFloor(id: string, insertFloor: InsertFloor): Promise<Floor | undefined> {
    const floor = { ...insertFloor, id } as Floor;
    await db.collection('floors').doc(id).set(floor);
    return floor;
  }

  async deleteFloor(id: string): Promise<boolean> {
    await db.collection('floors').doc(id).delete();
    return true;
  }

  // Rooms
  async getRooms(): Promise<Room[]> {
    const snapshot = await db.collection('rooms').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const doc = await db.collection('rooms').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Room;
  }

  async getRoomsByFloor(floorId: string): Promise<Room[]> {
    const snapshot = await db.collection('rooms').where('floorId', '==', floorId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
  }

  async getRoomsByBuilding(buildingId: string): Promise<Room[]> {
    const snapshot = await db.collection('rooms').where('buildingId', '==', buildingId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const room = { ...insertRoom, id } as Room;
    await db.collection('rooms').doc(id).set(room);
    return room;
  }

  async updateRoom(id: string, insertRoom: InsertRoom): Promise<Room | undefined> {
    const room = { ...insertRoom, id } as Room;
    await db.collection('rooms').doc(id).set(room);
    return room;
  }

  async deleteRoom(id: string): Promise<boolean> {
    await db.collection('rooms').doc(id).delete();
    return true;
  }

  // Staff
  async getStaff(): Promise<Staff[]> {
    const snapshot = await db.collection('staff').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff));
  }

  async getStaffMember(id: string): Promise<Staff | undefined> {
    const doc = await db.collection('staff').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Staff;
  }

  async getStaffByBuilding(buildingId: string): Promise<Staff[]> {
    const snapshot = await db.collection('staff').where('buildingId', '==', buildingId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff));
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const id = randomUUID();
    const staffMember = { ...insertStaff, id } as Staff;
    await db.collection('staff').doc(id).set(staffMember);
    return staffMember;
  }

  async updateStaff(id: string, insertStaff: InsertStaff): Promise<Staff | undefined> {
    const staffMember = { ...insertStaff, id } as Staff;
    await db.collection('staff').doc(id).set(staffMember);
    return staffMember;
  }

  async deleteStaff(id: string): Promise<boolean> {
    await db.collection('staff').doc(id).delete();
    return true;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    const snapshot = await db.collection('events').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const doc = await db.collection('events').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event = { ...insertEvent, id, classification: insertEvent.classification || "Event" } as Event;
    await db.collection('events').doc(id).set(event);
    return event;
  }

  async updateEvent(id: string, insertEvent: InsertEvent): Promise<Event | undefined> {
    const event = { ...insertEvent, id, classification: insertEvent.classification || "Event" } as Event;
    await db.collection('events').doc(id).set(event);
    return event;
  }

  async deleteEvent(id: string): Promise<boolean> {
    await db.collection('events').doc(id).delete();
    return true;
  }

  // Walkpaths
  async getWalkpaths(): Promise<Walkpath[]> {
    const snapshot = await db.collection('walkpaths').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Walkpath));
  }

  async getWalkpath(id: string): Promise<Walkpath | undefined> {
    const doc = await db.collection('walkpaths').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Walkpath;
  }

  async createWalkpath(insertWalkpath: InsertWalkpath): Promise<Walkpath> {
    const id = randomUUID();
    const walkpath = { ...insertWalkpath, id } as Walkpath;
    await db.collection('walkpaths').doc(id).set(walkpath);
    return walkpath;
  }

  async updateWalkpath(id: string, insertWalkpath: InsertWalkpath): Promise<Walkpath | undefined> {
    const walkpath = { ...insertWalkpath, id } as Walkpath;
    await db.collection('walkpaths').doc(id).set(walkpath);
    return walkpath;
  }

  async deleteWalkpath(id: string): Promise<boolean> {
    await db.collection('walkpaths').doc(id).delete();
    return true;
  }

  // Drivepaths
  async getDrivepaths(): Promise<Drivepath[]> {
    const snapshot = await db.collection('drivepaths').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Drivepath));
  }

  async getDrivepath(id: string): Promise<Drivepath | undefined> {
    const doc = await db.collection('drivepaths').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Drivepath;
  }

  async createDrivepath(insertDrivepath: InsertDrivepath): Promise<Drivepath> {
    const id = randomUUID();
    const drivepath = { ...insertDrivepath, id } as Drivepath;
    await db.collection('drivepaths').doc(id).set(drivepath);
    return drivepath;
  }

  async updateDrivepath(id: string, insertDrivepath: InsertDrivepath): Promise<Drivepath | undefined> {
    const drivepath = { ...insertDrivepath, id } as Drivepath;
    await db.collection('drivepaths').doc(id).set(drivepath);
    return drivepath;
  }

  async deleteDrivepath(id: string): Promise<boolean> {
    await db.collection('drivepaths').doc(id).delete();
    return true;
  }

  // Admin
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const snapshot = await db.collection('admins').where('username', '==', username).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as AdminUser;
  }

  async createAdmin(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const admin: AdminUser = { ...insertAdmin, id };
    await db.collection('admins').doc(id).set(admin);
    return admin;
  }

  // Settings
  async getSettings(): Promise<Setting[]> {
    const snapshot = await db.collection('settings').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Setting));
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const snapshot = await db.collection('settings').where('key', '==', key).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Setting;
  }

  async createSetting(insertSetting: InsertSetting): Promise<Setting> {
    const id = randomUUID();
    const setting: Setting = { ...insertSetting, id };
    await db.collection('settings').doc(id).set(setting);
    return setting;
  }

  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const existing = await this.getSetting(key);
    if (!existing) {
      return undefined;
    }
    const updated: Setting = { 
      id: existing.id,
      key: existing.key,
      value,
      description: existing.description || null
    };
    await db.collection('settings').doc(existing.id).set(updated);
    return updated;
  }

  async exportToJSON(): Promise<void> {
    // Export functionality no longer needed - Firestore is the source of truth
    console.log('Export to JSON skipped - Firestore is the source of truth');
  }
}

export const storage = new DatabaseStorage();
