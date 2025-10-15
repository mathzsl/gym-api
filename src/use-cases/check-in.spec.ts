import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let gymsRepository: InMemoryGymsRepository;
let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    gymsRepository = new InMemoryGymsRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-1",
      name: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to check in a user at a gym", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice on the same day", async () => {
    const date = new Date(2025, 9, 15, 0, 0, 0);
    vi.setSystemTime(date);

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-1",
        userId: "user-1",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    const firstDate = new Date(2025, 9, 15, 0, 0);
    vi.setSystemTime(firstDate);

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    const secondDate = new Date(2025, 9, 16, 0, 0);
    vi.setSystemTime(secondDate);

    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    // gymsRepository.items.push({
    //   id: "gym-2",
    //   name: "TypeScript Gym",
    //   description: "",
    //   phone: "",
    //   latitude: new Decimal(-27.0742052),
    //   longitude: new Decimal(-49.4881091),
    // });

    await expect(() =>
      sut.execute({
        gymId: "gym-1",
        userId: "user-1",
        userLatitude: -27.0742052,
        userLongitude: -49.4881091,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
